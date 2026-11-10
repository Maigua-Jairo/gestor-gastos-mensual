# Esquema de Base de Datos - Control de Gastos (Supabase)

Este documento contiene la estructura DDL completa en SQL para la base de datos PostgreSQL de la aplicación **Control de Gastos Mensual**, incluyendo tipos enumerados, definiciones de tablas con restricciones de clave foránea en cascada y políticas de seguridad RLS (Row Level Security).

---

## 1. Tipos Enumerados (ENUMs)

```sql
-- savings se conserva por compatibilidad con gastos históricos.
-- Los presupuestos y nuevos gastos de la aplicación usan los primeros 3 valores.
create type public.block_type as enum ('basic_needs', 'personal_needs', 'luxuries', 'savings');

-- Tipo enumerado para los movimientos en el fondo de ahorro
create type public.savings_movement_type as enum ('deposit', 'withdrawal');
```

---

## 2. Definición de Tablas

### 2.1. Tabla `months` (Control Lógico del Calendario)
Almacena la gestión mensual activa por usuario.

```sql
create table public.months (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  year int not null,
  month int not null check (month between 1 and 12),
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, year, month)
);
```

### 2.2. Tabla `incomes` (Ingresos Mensuales)
Registra el ingreso total del usuario para un mes específico.

```sql
create table public.incomes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  month_id uuid references public.months(id) on delete cascade not null,
  total_amount numeric(10,2) not null check (total_amount >= 0),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(month_id)
);
```

### 2.3. Tabla `budgets` (Presupuestos por Bloque)
Establece el monto asignado para cada uno de los 3 bloques de gastos del mes. El valor histórico `savings`, si existe, se elimina al guardar el presupuesto desde la aplicación.

```sql
create table public.budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  month_id uuid references public.months(id) on delete cascade not null,
  block block_type not null,
  allocated_amount numeric(10,2) not null check (allocated_amount >= 0),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(month_id, block)
);
```

### 2.4. Tabla `expenses` (Gastos Realizados)
Detalla cada transacción o consumo registrado dentro de un bloque del mes. La aplicación ya no crea gastos con el bloque `savings`; este valor del enum se conserva para poder consultar registros anteriores.

```sql
create table public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  month_id uuid references public.months(id) on delete cascade not null,
  block block_type not null,
  category text not null,
  amount numeric(10,2) not null check (amount > 0),
  expense_date date not null default current_date,
  note text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

### 2.5. Tabla `savings_movements` (Histórico de Fondo de Ahorro)
Lleva el historial de depósitos y retiros de emergencia del pozo de ahorros general.

```sql
create table public.savings_movements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  type savings_movement_type not null,
  amount numeric(10,2) not null check (amount > 0),
  note text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

---

## 3. Seguridad de Nivel de Fila (Row Level Security - RLS)

### 3.1. Habilitación de RLS en todas las tablas

```sql
alter table public.months enable row level security;
alter table public.incomes enable row level security;
alter table public.budgets enable row level security;
alter table public.expenses enable row level security;
alter table public.savings_movements enable row level security;
```

### 3.2. Políticas de Acceso (Aislamiento por `user_id`)

Garantiza que los usuarios solo tengan acceso completo (SELECT, INSERT, UPDATE, DELETE) a sus propios registros en la base de datos.

```sql
create policy "Users manage own months" 
  on public.months for all 
  using (auth.uid() = user_id);

create policy "Users manage own incomes" 
  on public.incomes for all 
  using (auth.uid() = user_id);

create policy "Users manage own budgets" 
  on public.budgets for all 
  using (auth.uid() = user_id);

create policy "Users manage own expenses" 
  on public.expenses for all 
  using (auth.uid() = user_id);

create policy "Users manage own savings" 
  on public.savings_movements for all 
  using (auth.uid() = user_id);
```