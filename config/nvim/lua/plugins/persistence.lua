return {
  {
    "folke/persistence.nvim",
    event = "BufReadPre",
    opts = {},
    init = function()
      if vim.fn.argc() == 0 then
        vim.api.nvim_create_autocmd("VimEnter", {
          once = true,
          callback = function()
            vim.defer_fn(function()
              require("persistence").load()
              require("snacks").explorer()
            end, 100)
          end,
        })
      end
    end,
    keys = {
      { "<leader>qs", function() require("persistence").load() end, desc = "Restore Session" },
      { "<leader>ql", function() require("persistence").load({ last = true }) end, desc = "Restore Last Session" },
      { "<leader>qd", function() require("persistence").stop() end, desc = "Don't Save Current Session" },
    },
  },
}
