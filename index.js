var chimneypot = require('chimneypot');
const shell = require('shelljs')

var pot = new chimneypot({
  port: 9999,
  path: '/hook',
  secret: 'YOUR_SECRET'
});

var config = {
  repos: [
    {
        prefix: "GIT_SSH_COMMAND=\"ssh -i /root/.ssh/deploy_site\" ",
        repo: "My/REPO",
        branch: "main",
        directory: "/root/MyRepo",
        commands: [
        ]
    }
  ]
}

pot.route('push', function (event) {
  config.repos.forEach(repo => {
    if (event.payload.repository.full_name == repo.repo && event.payload.ref == "refs/heads/" + repo.branch) {
      shell.cd(repo.directory);
      shell.exec("git pull");
      repo.commands.forEach(command => {
        shell.exec(command);
      });
      console.log("Pulled and relaunched " + event.payload.repository.full_name);
    }
  });
});

pot.listen();