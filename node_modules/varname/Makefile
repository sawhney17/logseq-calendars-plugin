include Makefile.node

export EXPECTED_COVERAGE := 85

VERSION=`node -e "process.stdout.write(require('./package.json').version)"`
HOMEPAGE=`node -e "process.stdout.write(require('./package.json').homepage)"`

all: install ci bundle

# Bundle client-side JavaScript
bundle:
	@echo "/*! Varname $(VERSION) | $(HOMEPAGE) */" > build/varname.js
	@echo "/*! Varname $(VERSION) | $(HOMEPAGE) */" > build/varname.min.js
	@browserify ./lib/varname --standalone varname >> build/varname.js
	@browserify ./lib/varname --standalone varname | uglifyjs >> build/varname.min.js
	@browserify ./test/unit/setup ./test/unit/lib/varname > build/test.js
	@$(TASK_DONE)
