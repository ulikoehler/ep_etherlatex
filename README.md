# A server-side LaTeX compiler for Etherpad lite

ep_etherlatex is a simple, server-side pdflatex compiler for [etherpad lite](https://github.com/ulikoehler/ep_etherlatex).
It is the result of failed attempts to get [FlyLaTeX](https://github.com/alabid/flylatex) running in a satisfying way.

ep_etherlatex adds a button to the right menubar (you won't miss it!). When you click on it, a new tab/window is opened that either shows the compiled PDF, or (if the compilation failed) the output log.

Currently the plugin assumes you have a working *pdflatex* installation on the etherpad server, which is in the *PATH* and can be executed by the user running etherpad. For each compilation, a temporary directory is created, and immediately deleted after sending back the results to the user.

## Installation

Ensure etherpad-lite is installed and running before installing *ep_etherlatex*!

To install, execute `git clone https://github.com/ulikoehler/ep_etherlatex.git` in the `node_modules` subdirectory of your etherpad lite installation directory.

After that, you need to install some dependencies for *ep_etherlatex* itself. In order to do this, execute `npm install` inside the cloned `ep_etherlatex` directory.

The overall workflow could look like this:
```bash
cd $EPLITE_HOME
cd node_modules
git clone https://github.com/ulikoehler/ep_etherlatex.git
cd ep_etherlatex
npm install
```

## Related projects

Also take a look at [ep_latex](https://github.com/manuels/ep_latex) which uses [texlive.js](https://github.com/manuels/texlive.js) , an [emscripten](https://github.com/kripken/emscripten)-compiled version of [TeXLive](http://texlive.org). As noted on the texlive.js website, there are only three TeX packages supported -- in my tests, this has proven to be a huge limitation -- additionally, the compilation speed is quite slow.

## Authors

ep_etherlatex was created by [Uli Köhler](http://techoverflow.net).

## Contributing

Any contribution will be highly appreciated!
Please submit GitHub Pull Requests and/or Issues!

## License

ep_etherlatex is released under [Apache License v2](http://www.apache.org/licenses/LICENSE-2.0.html), just like etherpad lite itself.