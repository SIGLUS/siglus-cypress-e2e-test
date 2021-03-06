## Prepare
1. first install npm and node in your machine, make sure your node version > 10, run `node -v`
2. cd to your project root folder and execute `npm install`

## Run e2e tests
1. modify `baseUrl`, `username` adn `password` in cypress.env.json file
2. execute `./node_modules/.bin/cypress open`

## Check eslint
execute `npm run check`

## Config Talisman

Talisman is a tool that installs a hook to your repository to ensure that potential secrets or sensitive information do not leave the developer's workstation.
It validates the outgoing changeset for things that look suspicious - such as potential SSH keys, authorization tokens, private keys etc.

```
# download the talisman binary
curl https://thoughtworks.github.io/talisman/install.sh > ~/install-talisman.sh
chmod +x ~/install-talisman.sh
# go to project
cd siglus-api
# delete pre-push if existed
rm .git/hooks/pre-push
# install new pre-push hook
~/install-talisman.sh
```
