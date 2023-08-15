// 发布订阅模式
const publish = {
    // 用来存储各种事件
    list: {},
    on(taskName, fn) {
        if (!this.list[taskName]) {
            this.list[taskName] = [];
        }
        this.list[taskName].push(fn);
    },
    emit(taskName, value) {
        this.list[taskName].forEach(item => {
            item(value);
        })
    },
    off(taskName, fn) {
        if (!this.list[taskName]) return;

        const taskList = this.list[taskName];
        for(let i = 0; i < taskList.length; i++) {
            if (taskList[i] === fn) {
                taskList.splice(i, 1);
                return;
            }
        }
    }
}


// 题目描述：
function format(value) {
    let fen = value % 10;
    value = (value - fen) / 10;
    let jiao = value % 10;
    value = (value - jiao) / 10;

    return `${value}元${jiao}角${fen}分`;
}
class RMB {
    constructor(value) {
        // 105
        this.originValue = value;
    }
    // cash2
    add(rmb) {
        const result = this.originValue + rmb.getValue();
        return new RMB(result);
    }
    getValue() {
        return this.originValue;
    }
    static add(value1, value2) {
        return new RMB(value1.getValue() + value2.getValue())
   }
}
RMB.prototype.valueOf = function() {
    return this.originValue;
}

RMB.prototype.toString = function() {
    return format(this.originValue);
}

const cash1 = new RMB(105);
const cash2 = new RMB(64);
const cash3 = cash1.add(cash2);
const cash4 = RMB.add(cash1, cash2);

const cash5 = new RMB(cash1 + cash2);
console.log(`${cash3}`, `${cash4}`, `${cash5}`);
// 在以上代码执行的时候，输出结果为：​
// 1元6角9分, 1元6角9分, 1元6角9分

