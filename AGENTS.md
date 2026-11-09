# AGENTS.md

Limit the amount of comments you put in the code to a strict minimum. You should almost never add comments, except sometimes on non-trivial code, function definitions if the arguments aren't self-explanatory, and class definitions and their members.

Do not remove existing comments unless they are directly related to what you are changing.

If you see a good first bug that isn't directly related to your work, don't hesitate to propose it as a good first bug

It is not advisable to run `rg` or `grep` commands blindly without specifying the directory scope for the search. If you must perform a local text search via the shell, it is recommended to use `rg`, which is faster than `grep`.