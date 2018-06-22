## How to manage translations
### Option 1 (Crowdin CLI)
- install crowdin cli from https://support.crowdin.com/cli-tool/
- configure `CROWDIN_API_KEY` and `CROWDIN_PROJECT` env variables (find them on Crowdin in API tab)
- from inside the `{projectRoot}/intl` folder execute the commands:
    - `crowdin upload sources` to upload sources or
    - `crowdin download`/`crowdin download -l zh_CN` to download all or specific language
    - NOTE: You can use `crowdin lint` for configuration validation
- translation files will be inside `master` folder so it's necessary to move them to the parent dir.
    Note: To add a new file, add it to `crowdin.yml` file (use others as example)

### Option 2 (using git)
- build project from crowdin interface
- sync with github repo (in integrations section) from crowdin interface
- clone `Translations` repo
- checkout to `l10n_master3`
- copy the desired folders to `{projectRoot}/intl`


#### Note: You should restart / start application after each modification.
