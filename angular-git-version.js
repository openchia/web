const git = require('git-rev-sync');
const { writeFileSync } = require('fs');
const tagName = git.tag();

const gitInfo = {
    commitShort: git.short(),
    commitLong: git.long(),
    branchName: git.branch(),
    tagName: tagName && git.isTagDirty() === false ? tagName : 'None',
    date: git.date()
};

const ts = 'export const gitVersion = ' + JSON.stringify(gitInfo, null, 2);
writeFileSync('./src/environments/git-version.ts', ts);
