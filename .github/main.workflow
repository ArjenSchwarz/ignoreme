workflow "Build and Deploy Hugo Site" {
  on = "push"
  resolves = ["Master To Prod S3", "Feature To Test S3"]
}

action "Build" {
  uses = "ArjenSchwarz/actions/hugo/build@master"
  secrets = ["GITHUB_TOKEN"]
}

action "ProdFilter" {
  uses = "actions/bin/filter@707718ee26483624de00bd146e073d915139a3d8"
  needs = ["Build"]
  args = "branch master"
}

action "Master To Prod S3" {
  needs = ["ProdFilter"]
  uses = "ArjenSchwarz/actions/aws/s3sync@master"
  args = "--cf-invalidate --default-mime-type=application/json"
  secrets = ["AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY"]
  env = {
    S3_BUCKET_URL = "s3://ignoreme-site"
    SOURCE_DIR = "public"
    ONLY_IN_BRANCH = "master"
  }
}

action "FeatureFilter" {
  uses = "actions/bin/filter@707718ee26483624de00bd146e073d915139a3d8"
  needs = ["Build"]
  args = "branch feature*"
}

action "Feature To Test S3" {
  needs = ["FeatureFilter"]
  uses = "ArjenSchwarz/actions/aws/s3sync@master"
  args = "--cf-invalidate --default-mime-type=application/json"
  secrets = ["AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY"]
  env = {
    S3_BUCKET_URL = "s3://private.ig.nore.me"
    SOURCE_DIR = "public"
  }
}
