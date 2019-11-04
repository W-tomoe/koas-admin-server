class BaseModel {
    constructor(data, message, ...opt) {
        if (typeof data === 'string') {
            this.message = data
            data = null
            message = null
        }

        if (data) {
            this.data = data
        }

        if (message) {
            this.message = message
        }

        for(let key in opt) {
            this[key] = opt[key]
        }
    }
}


class SuccessModel extends BaseModel {
    constructor(data, message) {
        super(data, message)
        this.status = 1
    }
}

class ErrorModel extends BaseModel {
    constructor(data, message) {
        super(data, message)
        this.status = 0
    }
}

class LoginErrorModel extends BaseModel {
    constructor(data, message) {
        super(data, message)
        this.status = -1
    }
}

module.exports = {
    SuccessModel,
    ErrorModel,
    LoginErrorModel
}