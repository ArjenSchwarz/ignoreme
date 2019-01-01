workflow "Build and Deploy Hugo Site" {
  on = "push"
  resolves = ["Sync"]
}

action "Build" {
  uses = "ArjenSchwarz/action-hugo-build@master"
  secrets = ["GITHUB_TOKEN"]
}

action "Sync" {
  needs = ["Build"]
  uses = "ArjenSchwarz/actions-aws/s3sync@master"
  args = "--cf-invalidate --default-mime-type=application/json"
  secrets = ["AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY", "S3_BUCKET_URL"]
  env = {
    SOURCE_DIR = "public"
    ONLY_IN_BRANCH = "master"
  }
}
