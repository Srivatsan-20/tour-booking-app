-- Step 1: Create BusExpenses table
CREATE TABLE [BusExpenses] (
    [Id] int NOT NULL IDENTITY,
    [TripExpenseId] int NOT NULL,
    [BusNumber] nvarchar(100) NOT NULL,
    [DriverBatta] decimal(18,2) NOT NULL,
    [NumberOfDays] int NOT NULL,
    CONSTRAINT [PK_BusExpenses] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_BusExpenses_TripExpenses_TripExpenseId] FOREIGN KEY ([TripExpenseId]) REFERENCES [TripExpenses] ([Id]) ON DELETE CASCADE
);

-- Step 2: Create index for BusExpenses
CREATE INDEX [IX_BusExpenses_TripExpenseId] ON [BusExpenses] ([TripExpenseId]);

-- Step 3: Migrate existing data - Create one BusExpense per TripExpense
INSERT INTO BusExpenses (TripExpenseId, BusNumber, DriverBatta, NumberOfDays)
SELECT 
    Id as TripExpenseId,
    'Bus 1' as BusNumber,
    DriverBatta,
    NumberOfDays
FROM TripExpenses;

-- Step 4: Add BusExpenseId column to FuelEntries
ALTER TABLE [FuelEntries] ADD [BusExpenseId] int NULL;

-- Step 5: Add BusExpenseId column to OtherExpenses
ALTER TABLE [OtherExpenses] ADD [BusExpenseId] int NULL;

-- Step 6: Update FuelEntries to point to BusExpenses
UPDATE FuelEntries
SET BusExpenseId = (
    SELECT be.Id
    FROM BusExpenses be
    WHERE be.TripExpenseId = FuelEntries.TripExpenseId
)
WHERE BusExpenseId IS NULL;

-- Step 7: Update OtherExpenses to point to BusExpenses
UPDATE OtherExpenses
SET BusExpenseId = (
    SELECT be.Id
    FROM BusExpenses be
    WHERE be.TripExpenseId = OtherExpenses.TripExpenseId
)
WHERE BusExpenseId IS NULL;

-- Step 8: Make BusExpenseId non-nullable
ALTER TABLE [FuelEntries] ALTER COLUMN [BusExpenseId] int NOT NULL;
ALTER TABLE [OtherExpenses] ALTER COLUMN [BusExpenseId] int NOT NULL;

-- Step 9: Add foreign key constraints
CREATE INDEX [IX_FuelEntries_BusExpenseId] ON [FuelEntries] ([BusExpenseId]);
CREATE INDEX [IX_OtherExpenses_BusExpenseId] ON [OtherExpenses] ([BusExpenseId]);

ALTER TABLE [FuelEntries] ADD CONSTRAINT [FK_FuelEntries_BusExpenses_BusExpenseId] 
    FOREIGN KEY ([BusExpenseId]) REFERENCES [BusExpenses] ([Id]) ON DELETE CASCADE;

ALTER TABLE [OtherExpenses] ADD CONSTRAINT [FK_OtherExpenses_BusExpenses_BusExpenseId] 
    FOREIGN KEY ([BusExpenseId]) REFERENCES [BusExpenses] ([Id]) ON DELETE CASCADE;

-- Step 10: Remove old foreign key constraints and columns
ALTER TABLE [FuelEntries] DROP CONSTRAINT [FK_FuelEntries_TripExpenses_TripExpenseId];
ALTER TABLE [OtherExpenses] DROP CONSTRAINT [FK_OtherExpenses_TripExpenses_TripExpenseId];

DROP INDEX [IX_FuelEntries_TripExpenseId] ON [FuelEntries];
DROP INDEX [IX_OtherExpenses_TripExpenseId] ON [OtherExpenses];

ALTER TABLE [FuelEntries] DROP COLUMN [TripExpenseId];
ALTER TABLE [OtherExpenses] DROP COLUMN [TripExpenseId];

-- Step 11: Remove DriverBatta and NumberOfDays from TripExpenses (now in BusExpenses)
ALTER TABLE [TripExpenses] DROP COLUMN [DriverBatta];
ALTER TABLE [TripExpenses] DROP COLUMN [NumberOfDays];

-- Step 12: Add migration record
INSERT INTO [__EFMigrationsHistory] ([MigrationId], [ProductVersion])
VALUES ('20250709103000_MigrateToBusBasedStructure', '9.0.5');
