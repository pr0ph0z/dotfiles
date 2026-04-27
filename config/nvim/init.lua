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

-- Command+Left/Right for start/end of line (requires terminal to pass Cmd key)
vim.keymap.set({'n', 'v'}, '<D-Left>', '^', { noremap = true })
vim.keymap.set({'n', 'v'}, '<D-Right>', '$', { noremap = true })
vim.keymap.set('i', '<D-Left>', '<C-o>^', { noremap = true })
vim.keymap.set('i', '<D-Right>', '<C-o>$', { noremap = true })
