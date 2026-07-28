# Todo

Todo comments extension for Lvce Editor.

The Todo view scans the current workspace when it opens and lists `TODO`,
`FIXME`, `HACK`, `BUG`, and `XXX` comments. Selecting an item opens its source
file at the matching line. Generated, dependency, cache, build, coverage, and
version-control folders are excluded from scans.

## Development

```sh
npm ci
npm run build
npm test
```
