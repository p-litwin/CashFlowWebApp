1. Zapytanie zwracające sumę wydatków dla poszczególnych kategorii dla użytkownika o id=1 w zakresie dat: 01.05.2023 - 31.05.2023
SELECT
    expenseCategories.expenseCategory,
    SUM(expenses.amount)
FROM expenses
LEFT JOIN expenseCategories ON expenseCategories.expenseCategoryId=expenses.expenseCategory
WHERE expenses.userId=1 AND expenses.date>="2023-05-01" AND expenses.date<="2023-05-31"
GROUP BY expenseCategories.expenseCategory;

2. Usuwanie kategorii 
Jeśli zostanie usunięta kategoria, do której są przypisane przychody/wydatki, wartość kategorii przypisanej do tych pozycji zmieni się na NULL.
W bilansie pozycje z NULLem w kategorii zostaną wyświetlone jako "Bez kategorii".

3. Dodawanie nowej kategorii, lub zmiana nazwy istniejącej:
    1. Pobierz od użytkownika nazwę kategorii
    2. Zamień wprowadzony ciąg na małe litery
    3. Usuń z ciągu zbędne białe znaki
    4. Wykonaj zapytanie do bazy zwracające wszystkie kategorie danego użytkownika
    5. Sprawdź czy w zwróconych wynikach znajduje się nowo wprowadzona kategoria
    Jeśli w wynikach jest wartość identyczna z tą wprowadzoną, wyświetl komunikat "Kategoria już istnieje" i zakończ skrypt.
    6. Jeśli wartość nie zostanie znaleziona w wynikach zapytania, dodaj nową kategorię do bazy dla zalogowanego użytkownika.
