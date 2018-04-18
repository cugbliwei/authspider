package task

import (
	"fmt"
	"testing"

	"github.com/cugbliwei/authspider/context"
	"github.com/cugbliwei/authspider/extractor"
	"github.com/cugbliwei/dlog"
	"github.com/stretchr/testify/assert"
)

func TestExtractorWithContext(t *testing.T) {
	var html = `
        <html>
            <body>
                <div>Hello</div>
            </body>
        </html>
    `
	c := context.NewContext(nil, nil, nil)
	ret, err := extractor.Extract([]byte(html), "div||{{contains ._v \"Hello\"}}", "html", c)
	dlog.Warn("ret:", ret)
	if err != nil {
		t.Error(err)
		return
	}
	assert.Equal(t, fmt.Sprintf("%v", ret), "true")
}
