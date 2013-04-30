all: lint test coverage

clean:
	@rm -f coverage.html sauce_connect.log

lint:
	@node_modules/.bin/jshint bin lib

test:
	@node_modules/.bin/mocha

tap:
	@node_modules/.bin/mocha --reporter tap

testem:
	@node_modules/.bin/testem

testem-ci:
	@node_modules/.bin/testem ci

coverage:
	@mv lib lib-bak
	@jscoverage lib-bak lib
	@node_modules/.bin/mocha --reporter html-cov > coverage.html
	@rm -rf lib
	@mv lib-bak lib

todo:
	@fgrep -H -e TODO -e FIXME -r bin lib test || true

.PHONY: clean lint test tap testem testem-ci coverage todo
