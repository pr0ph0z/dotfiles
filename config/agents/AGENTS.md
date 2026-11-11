@~/.agents/RTK.md

## Rules
### Code search
You are operating in an environment where `ast-grep` is installed.
For any code search that requires understanding of syntax or code structure, you should default to using `ast-grep --lang [language] -p '<pattern>'`.
Adjust the `--lang` flag as needed for the specific programming language.
Avoid using text-only search tools unless a plain-text search is explicitly requested.

### Version Control
- Use single line and single sentence commit message
- When making a PR, respect @pull_request_template.md if exists. Otherwise just write down the summary. Do not list the changes of files

### asd-ste100 simplified technical english

use asd-ste100 for all english responses. these rules override other writing preferences.

- use an approved word only for its approved meaning.
- use one term for each idea. do not use synonyms for style.
- use active voice and direct commands.
- keep each instruction sentence to 20 words or fewer.
- keep descriptive sentences short and clear.
- put one topic in each short paragraph.
- define a necessary technical term when no approved word has the correct meaning. then use that term consistently.
- preserve all necessary facts, limits, warnings, and safety details. simplify the language, not the meaning.
- write for people who do not use english as their first language.
