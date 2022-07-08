oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![Downloads/week](https://img.shields.io/npm/dw/oclif-hello-world.svg)](https://npmjs.org/package/oclif-hello-world)
[![License](https://img.shields.io/npm/l/oclif-hello-world.svg)](https://github.com/oclif/hello-world/blob/main/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g partner-training-tools
$ ptt COMMAND
running command...
$ ptt (--version)
partner-training-tools/0.0.0 darwin-x64 node-v16.14.2
$ ptt --help [COMMAND]
USAGE
  $ ptt COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`ptt hello PERSON`](#ptt-hello-person)
* [`ptt hello world`](#ptt-hello-world)
* [`ptt help [COMMAND]`](#ptt-help-command)
* [`ptt init`](#ptt-init)
* [`ptt login`](#ptt-login)
* [`ptt plugins`](#ptt-plugins)
* [`ptt plugins:install PLUGIN...`](#ptt-pluginsinstall-plugin)
* [`ptt plugins:inspect PLUGIN...`](#ptt-pluginsinspect-plugin)
* [`ptt plugins:install PLUGIN...`](#ptt-pluginsinstall-plugin-1)
* [`ptt plugins:link PLUGIN`](#ptt-pluginslink-plugin)
* [`ptt plugins:uninstall PLUGIN...`](#ptt-pluginsuninstall-plugin)
* [`ptt plugins:uninstall PLUGIN...`](#ptt-pluginsuninstall-plugin-1)
* [`ptt plugins:uninstall PLUGIN...`](#ptt-pluginsuninstall-plugin-2)
* [`ptt plugins update`](#ptt-plugins-update)
* [`ptt run [FROMROW] [TOROW]`](#ptt-run-fromrow-torow)

## `ptt hello PERSON`

Say hello

```
USAGE
  $ ptt hello [PERSON] -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Whom is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [dist/commands/hello/index.ts](https://github.com/kobay/partner-training-tools/blob/v0.0.0/dist/commands/hello/index.ts)_

## `ptt hello world`

Say hello world

```
USAGE
  $ ptt hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ oex hello world
  hello world! (./src/commands/hello/world.ts)
```

## `ptt help [COMMAND]`

Display help for ptt.

```
USAGE
  $ ptt help [COMMAND] [-n]

ARGUMENTS
  COMMAND  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for ptt.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.10/src/commands/help.ts)_

## `ptt init`

設定ファイルの雛形を生成します。

```
USAGE
  $ ptt init [-f]

FLAGS
  -f, --force  設定ファイルを強制的に作り直し

DESCRIPTION
  設定ファイルの雛形を生成します。

EXAMPLES
  $ ptt init
```

_See code: [dist/commands/init.ts](https://github.com/kobay/partner-training-tools/blob/v0.0.0/dist/commands/init.ts)_

## `ptt login`

各サービスにログインし、トークンをキャッシュします

```
USAGE
  $ ptt login [-b] [-s]

FLAGS
  -b, --box    boxにログイン
  -s, --sheet  sheetにログイン

DESCRIPTION
  各サービスにログインし、トークンをキャッシュします

EXAMPLES
  $ ptt login
```

_See code: [dist/commands/login.ts](https://github.com/kobay/partner-training-tools/blob/v0.0.0/dist/commands/login.ts)_

## `ptt plugins`

List installed plugins.

```
USAGE
  $ ptt plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ ptt plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.0.11/src/commands/plugins/index.ts)_

## `ptt plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ ptt plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.

  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ ptt plugins add

EXAMPLES
  $ ptt plugins:install myplugin 

  $ ptt plugins:install https://github.com/someuser/someplugin

  $ ptt plugins:install someuser/someplugin
```

## `ptt plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ ptt plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ ptt plugins:inspect myplugin
```

## `ptt plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ ptt plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.

  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ ptt plugins add

EXAMPLES
  $ ptt plugins:install myplugin 

  $ ptt plugins:install https://github.com/someuser/someplugin

  $ ptt plugins:install someuser/someplugin
```

## `ptt plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ ptt plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.

  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.

EXAMPLES
  $ ptt plugins:link myplugin
```

## `ptt plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ ptt plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ ptt plugins unlink
  $ ptt plugins remove
```

## `ptt plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ ptt plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ ptt plugins unlink
  $ ptt plugins remove
```

## `ptt plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ ptt plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ ptt plugins unlink
  $ ptt plugins remove
```

## `ptt plugins update`

Update installed plugins.

```
USAGE
  $ ptt plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```

## `ptt run [FROMROW] [TOROW]`

Google Sheetの情報を取得、TableauからPDFをダウンロード、Boxにアップロードします。

```
USAGE
  $ ptt run [FROMROW] [TOROW] [-s]

ARGUMENTS
  FROMROW  [default: 2] Google Sheetの対象行
  TOROW    Google Sheetの対象終了行。指定しない場合は、指定行の1行のみ処理。

FLAGS
  -s, --sheet  Google Sheetの情報だけを表示します。

DESCRIPTION
  Google Sheetの情報を取得、TableauからPDFをダウンロード、Boxにアップロードします。

EXAMPLES
  $ ptt run
```

_See code: [dist/commands/run.ts](https://github.com/kobay/partner-training-tools/blob/v0.0.0/dist/commands/run.ts)_
<!-- commandsstop -->
