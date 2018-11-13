# it-prosjekt

## Making changes to working branch
1. Make changes
2. See what was changed with 
```
git status
```
3. Stage files you want to add to this commit (version)
```
git add <file1> <file2> ...
```
or add ALL files
```
git add .
```
4. Commit changes, adding a commit-message
```
git commit -m "commit-message here"
```
5. Pull latest changes from remote (GitHub), and rebase to fix ahead-of-master
   issues
```
git pull origin master --rebase
```
6. Push your changes to master-branch
```
git push origin master
```
remember to provide GitHub credentials.

## Branching (usefull for working on different features in same file)
1. Create new branch (parallell to "main"-release, master)
``` 
git branch <branch-name>
```
2. Checkout the branch (moving you over to the paralell-release, <branch-name>)
```
git checkout <branch-name>
```
3. You can see which branch you are currently on with
```
git status
```
the first line will indicate which branch you are on.
Moving back to master-branch:
```
git checkout master
```

You can now make changes to your own branch, without conflicting with other
team-members changes. Instead of pushing and pulling from 'master', push and
pull from your branch:
```
git pull origin <branch-name> (--rebase)
git push origin <branch-name>
```

When you are ready to merge your branch into master, create a Pull Request
through the GitHub.com GUI, and wait for a quick code-review and an easy merge!


### Stashing
Stashing is a way of keeping your changes when checking out another branch etc.
By using the command
```
git stash
```
you place your unstaged changes in the current directory in a stash-stack. You
can now safely checkout the new branch.
When working in the p2-changes branch, you are only supposed to change the
``p2_design.html`` file. Commit the changes like normal:

```
git add p2_desig.html
git commit -m "your message here"
git push origin p2-changes
```

Note that the changes are not pushed to master, but to p2-changes.

You can now checkout master againn with
```
git checkout master
```

If you stashed your unstaged elements earlier and you want the changes back,
you need to pop them off the stash stack:
```
git stash pop
```

### Status
You can use 
```
git status
```
to figure out which branch you are working on.