workflow "Build Hugo Site" {
  on = "push"
  resolves = ["Build"]
}

action "Build" {
  uses = "ArjenSchwarz/action-hugo-build@master"
  args = "--theme=mytheme"
  secrets = ["GITHUB_TOKEN"]
}