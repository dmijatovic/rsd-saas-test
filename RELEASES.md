# Releases

This repo supports manual releases using github actions. To create draft release use "release_draft" action.
This action will create draft release, update CITATION.cff file and commit it to master branch.
When you publish the draft the tag will be applied to master branch and the images with that tag will be created using build images action.

## DRAFT RELEASE

Creating draft release is defined in release_draft.yml file. The action is executed manually (workflow_dispatch) from github interface.

The version is calculated using conventional changelog action. The deployment files are updated and zipped. Deployment.zip file contains:

- docker-compose.yml file which is updated with the latest version tag. Note the images will be build after release is created
- nginx.conf file
- env.example file
- README.md file
- CITATION.cff file

### Updating CITATION.cff file

Updated CITATION.cff file is committed to master branch. For this purpose we use _cff.yml shared/reusable action.
When pushing to protected branch (master/main) the reusable module (_cff.yml) needs to use PAT token in order to be able to push the commit. In order to achieve this the following steps are required:

- Create [PAT token for admin user](https://github.com/settings/token/new)
- Add [PAT token to action, repo secrets](https://github.com/dmijatovic/rsd-saas-test/settings/secrets/actions)
- Pass the token to _cff.yml file from the release_draft.yml. Note that secrets are not passed automatically to child modules and need to be passed explicitly to _cff.yml using secret property.

The info how to push to protected branched is [available on git-auto-commit-action](https://github.com/stefanzweifel/git-auto-commit-action?tab=readme-ov-file#push-to-protected-branches)

## BUILD IMAGES

After release draft is promoted to release, build_images.yml, will be activated. This action listens to published release event of github. At this point the main branch will be tagged with the version tag. This version tag is passed to build_images.yml and used to tag the images build. The images are uploaded to GHCR.
