action "Test" {
  uses = "ianwalter/puppeteer@v2.0.0"
  needs = ["Install"]
  runs = "yarn"
  args = "test"
}
