var router = require('express').Router()

  var CircleCI = require('circleci');
  var ci = new CircleCI({
    auth: process.env.TOKEN
  });

router.get('/', async function(req, res) {
  const util = require('util');
  const exec = util.promisify(require('child_process').exec);

  const { stdout, stderr } = await exec("ls ../ -p | grep \/");
  let repo = stdout.replace(/\//g, '')
  repo = repo.split('\n')
  repo.pop()

  res.render('main', {
    repo
  })

})


router.post('/build', async function(req, res) {
  var request = require('request');

  var headers = {
    'Content-Type': 'application/json'
  };

  var dataString = {                                                                                                                                                            
    "parallel": 2,
    "build_parameters": {
      "BUILD_FOR": process.env.BUILD_FOR
    }
  };

  var url = `https://circleci.com/api/v1.1/project/github/memberid/${req.body.repo}/tree/${req.body.branch}\?circle-token\=${process.env.TOKEN}`
  var options = {
    url: url,
    method: 'POST',
    headers: headers,
  };

  function callback(error, response, body) {
    if (!error) {
      res.json(response)
    }
  }

  request(options, callback);
})

router.post('/build2', function(req, res) {

  ci.startBuild({
    username: process.env.PROJECT,
    project: req.body.repo,
    branch: req.body.branch
  }).then(function(build){
    res.json(build)
  });
})

router.get('/build/:id', function(req, res) {
  ci.getBuild({
    username: process.env.PROJECT,
    project: req.query.repo,
    build_num: req.params.id
  }).then(function(build){
    res.json(build)
  });
})

module.exports = router
