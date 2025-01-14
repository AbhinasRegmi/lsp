## Create your own lsp

Read the [blog](https://blog.abhinasregmi.com.np/blog/lsp-implementation) for more information.

This lsp has the following features:
- Log out every communication between the editor and the server
- Go to defination feature
- Auto completion feature
- Error Diagnostic feature
- Syncing file state with server feature

The feature mentioned are just simple implementation. But we can extend these features using robust analyser.
Also in order to use this lsp. You need a following configuration in your nvim configuration.

```lua
-- create a file inside your lua folder
-- ~/.config/nvim/lua/test-lsp.lua

-- warning: I did for testing purpose.
-- you should give the exact location of your script.
-- It is better if you compile your ts and provide the script path.
-- Also make sure you can run the script from any path from the system.
-- For testing, I just used lsp only in the lsp project so the system could find the start:dev script
local client = vim.lsp.start_client {
  name = 'educationalLsp',
  cmd = { 'npm', 'run', 'start:dev' },
}

if not client then
  vim.notify "The lsp client didn't start correctly."
  return
end

-- this works for only .md (markdown) files
vim.api.nvim_create_autocmd('FileType', {
  pattern = 'markdown',
  callback = function()
    vim.lsp.buf_attach_client(0, client)
  end,
})

```

Now, in you `int.lua` file you should import the lsp
```lua
-- ~/.config/nvim/init.lua

-- test lsp => this is the file name from earlier.
require('test-lsp');

```

