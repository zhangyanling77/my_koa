const querystring = require('querystring')

module.exports = function bodyParser(){
    return async (ctx, next) => {
        await new Promise((resolve, reject) => {
            let dataArr = []; //存放数据的数组
            //接收数据
            ctx.req.on('data', data => dataArr.push(data));
            //整合数据并使用promise成功
            ctx.req.on('end', () => {
                //获取请求数据的类型 json或是表单
                let contentType = ctx.get('Content-Type');
                //获取数据 Buffer格式
                let data = Buffer.concat(dataArr).toString();

                if(contentType === 'application/x-www-form-urlencoded'){
                    //如果是表单提交，则将查询字符串转换成对象赋值给ctx.request.body
                    ctx.request.body = querystring.parse(data)
                } else if(contentType === 'application/json'){
                    //如果是json，则将字符串格式的对象转为对象赋值给ctx.request.body
                    ctx.request.body = JSON.parse(data)
                }
                //执行成功的回调
                resolve();
            })
        })

        //继续向下执行
        await next();
    }
}