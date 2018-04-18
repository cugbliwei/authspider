package task

import (
	"encoding/json"
	"io/ioutil"
	"strings"

	"github.com/cugbliwei/authspider/config"
	"github.com/cugbliwei/dlog"
)

type TaskManager struct {
	tasks   map[string]*Task
	rootDir string
}

type TaskManager1 struct {
	tasks   map[string]*Task1
	rootDir string
}

var TaskInstance *TaskManager
var TaskInstance1 *TaskManager1

func init() {
	TaskInstance = NewTaskManager("./etc/tmpls/")
	TaskInstance1 = NewTaskManager1("./etc/tmpls/")
}

func NewTaskManager(root string) *TaskManager {
	dir, err := ioutil.ReadDir(root)
	if err != nil {
		dlog.Error("can not find etc folder")
	}
	ret := &TaskManager{
		tasks:   make(map[string]*Task, 30),
		rootDir: root,
	}
	for _, f := range dir {
		if strings.HasSuffix(f.Name(), ".json") && !strings.HasSuffix(f.Name(), "2.json") {
			task := NewTask("./etc/tmpls/" + f.Name())
			dlog.Info("loaded:%v", f.Name())
			ret.tasks[f.Name()] = task
		}
	}
	ret.FixInclude()
	return ret
}

func NewTaskManager1(root string) *TaskManager1 {
	dir, err := ioutil.ReadDir(root)
	if err != nil {
		dlog.Error("can not find etc folder")
	}
	ret := &TaskManager1{
		tasks:   make(map[string]*Task1, 30),
		rootDir: root,
	}
	for _, f := range dir {
		if strings.HasSuffix(f.Name(), "2.json") {
			task := NewTask1("./etc/tmpls/" + f.Name())
			dlog.Info("loaded:%v", f.Name())
			ret.tasks[f.Name()] = task
		}
	}
	ret.FixInclude1()
	return ret
}

func (p *TaskManager) Get(tmpl string) *Task {
	if name, ok := config.Instance.Templates[tmpl]; ok {
		if task, ok2 := p.tasks[name]; ok2 {
			return task.DeepCopy()
		}
	} else {
		dlog.Error("fail to find name for tmpl %s", tmpl)
	}
	return nil
}

func (p *TaskManager) GetByName(name string) *Task {
	if task, ok := p.tasks[name]; ok {
		return task.DeepCopy()
	}
	return nil
}

func (p *TaskManager) GetJsonByName(name string) string {
	task := p.GetByName(name)
	if task != nil {
		data, _ := json.Marshal(task)
		return string(data)
	}
	return ""
}

func (p *TaskManager) GetJsonByTmpl(tmpl string) string {
	task := p.Get(tmpl)
	if task != nil {
		data, _ := json.Marshal(task)
		return string(data)
	}
	return ""
}

func (p *TaskManager) FixInclude() {
	for _, task := range p.tasks {
		steps := []*Step{}
		hasRequire := false
		for _, step := range task.Steps {
			if step.Require != nil {
				reqTask, ok := p.tasks[step.Require.File]
				if ok {
					steps = append(steps, p.GetSteps(reqTask, step.Require.From, step.Require.FromTag, step.Require.To)...)
				}
				hasRequire = true
			} else {
				steps = append(steps, step)
			}
		}
		if hasRequire {
			task.Steps = steps
		}
	}
}

func (p *TaskManager) GetSteps(task *Task, start, tag, end string) []*Step {
	ret := []*Step{}
	begin := false
	for _, step := range task.Steps {
		if step.Page == start || (len(step.Tag) > 0 && len(tag) > 0 && step.Tag == tag) {
			begin = true
		}
		if begin {
			ret = append(ret, step)
		}
		if len(end) > 0 && step.Page == end {
			break
		}
	}
	return ret
}

func (p *TaskManager1) Get1(tmpl string) *Task1 {
	if name, ok := config.Instance.Templates[tmpl]; ok {
		if task, ok2 := p.tasks[name]; ok2 {
			return task.DeepCopy1()
		}
	} else {
		dlog.Error("fail to find name for tmpl %s", tmpl)
	}
	return nil
}

func (p *TaskManager1) GetByName1(name string) *Task1 {
	if task, ok := p.tasks[name]; ok {
		return task.DeepCopy1()
	}
	return nil
}

func (p *TaskManager1) GetJsonByName1(name string) string {
	task := p.GetByName1(name)
	if task != nil {
		data, _ := json.Marshal(task)
		return string(data)
	}
	return ""
}

func (p *TaskManager1) GetJsonByTmpl1(tmpl string) string {
	task := p.Get1(tmpl)
	if task != nil {
		data, _ := json.Marshal(task)
		return string(data)
	}
	return ""
}

func (p *TaskManager1) FixInclude1() {
	for _, task := range p.tasks {
		steps := []*Step1{}
		hasRequire := false
		for _, step := range task.Steps {
			if step.Require != nil {
				reqTask, ok := p.tasks[step.Require.File]
				if ok {
					steps = append(steps, p.GetSteps1(reqTask, step.Require.From, step.Require.To)...)
				}
				hasRequire = true
			} else {
				steps = append(steps, step)
			}
		}
		if hasRequire {
			task.Steps = steps
		}
	}
}

func (p *TaskManager1) GetSteps1(task *Task1, start, end string) []*Step1 {
	ret := []*Step1{}
	begin := false
	for _, step := range task.Steps {
		if step.Page == start {
			begin = true
		}
		if begin {
			ret = append(ret, step)
		}
		if len(end) > 0 && step.Page == end {
			break
		}
	}
	return ret
}
