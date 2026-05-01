-- Move by word with Option + arrow keys
vim.keymap.set({'n', 'v'}, '<M-Left>',  'b', { noremap = true })
vim.keymap.set({'n', 'v'}, '<M-Right>', 'w', { noremap = true })

vim.keymap.set('i', '<M-Left>',  '<C-o>b', { noremap = true })
vim.keymap.set('i', '<M-Right>', '<C-o>w', { noremap = true })

-- Terminal sends <M-b>/<M-f> on macOS for Option+Left/Right
vim.keymap.set({'n', 'v'}, '<M-b>', 'b', { noremap = true })
vim.keymap.set({'n', 'v'}, '<M-f>', 'w', { noremap = true })

vim.keymap.set('i', '<M-b>', '<C-o>b', { noremap = true })
vim.keymap.set('i', '<M-f>', '<C-o>w', { noremap = true })

-- Faster escape-sequence parsing so <M-...> keys register properly
vim.o.ttimeout = true
vim.o.ttimeoutlen = 50

-- Delete by word with Option + Delete (macOS)
-- Option+Backspace deletes backward
vim.keymap.set('i', '<M-BS>', '<C-w>', { noremap = true })
vim.keymap.set('n', '<M-BS>', 'db', { noremap = true })

-- Alt synonyms (same as Meta in Neovim)
vim.keymap.set('i', '<A-BS>', '<C-w>', { noremap = true })
vim.keymap.set('n', '<A-BS>', 'db', { noremap = true })

-- Option+Delete (Fn+Delete) deletes forward
vim.keymap.set('i', '<M-d>', '<C-o>de', { noremap = true })
vim.keymap.set('n', '<M-d>', 'de', { noremap = true })

-- Command+Up/Down -> start/end of document
vim.keymap.set({'n', 'v'}, '<D-Up>',   'gg', { noremap = true })
vim.keymap.set({'n', 'v'}, '<D-Down>', 'G',  { noremap = true })
vim.keymap.set('i', '<D-Up>',   '<C-o>gg', { noremap = true })
vim.keymap.set('i', '<D-Down>', '<C-o>G',  { noremap = true })

-- Command+C -> copy visual selection to system clipboard
vim.keymap.set('v', '<D-c>', '"+y', { noremap = true })


-- Diagnostic: run `:Keycodes` in Neovim, then press the problematic key
-- to see what Neovim actually receives.
vim.api.nvim_create_user_command('Keycodes', function()
  print('Press any key (Ctrl-C to stop)...')
  while true do
    local c = vim.fn.getchar()
    if c == 3 then break end -- Ctrl-C
    print('Keycode: ' .. c .. '  |  String: ' .. vim.fn.nr2char(c))
  end
end, {})
