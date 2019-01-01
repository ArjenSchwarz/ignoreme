workflow "Build Hugo Site" {
  on = "push"
  resolves = ["Build"]
}

action "Build" {
  uses = "ArjenSchwarz/action-hugo-build@master"
  secrets = ["GITHUB_TOKEN"]
}