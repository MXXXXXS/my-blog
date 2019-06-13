# 评论功能

## 添加评论

POST http(s):xxxxxxx/comments?target=id&article=tilte *target为某篇文章或某文章的直接评论. 对评论的评论通过添加 @id 来实现, 并列存放. article为文章标题, 用于确定collection

### 上传格式

MIME Types: multipart/form-data

content: String  //存放评论内容评论

### 存放处理

1. 判断类型, target和article是否相同
2. 分配id
3. 若为文章评论, 则在对应collection内新增

        {
          id: String,
          content: String,
          sublength: Number,  //subComments的长度, 每次添加子评论时自增
          subComments: []
        }

4. 若target为某评论, 则在该评论的subComments中添加

       {
         id: String,
         content: String
       }

## 获取评论

GET http(s):xxxxxxx/comments?target=id&articel=currentArticle&offset=num
*target为文章id或评论id*

### 查询处理

1. 确定查询起始位置, 依据target
2. 若有记录上一次位置, 则从上一次位置继续查询, 否则从头开始.
3. 按最大数量限制遍历.
4. 若有后续, 记录此次查询的位置. 若没有更多, 则清除该target下的查询位置

### 返回

    //判断文章评论还是子评论通过比较target和article
    {
      finished: Boolean,  //这个选项用于确定"加载更多"功能
      comments: {
        id: content,
        ...
      },
    }

## 前端评论组件

### 评论存放

    commentsTree: {
      articleName0: {
        finished: Boolean,  //offset通过获取comments的长度获取
        comments: {
          id: {
            content: String,
            finished: Boolean,  //offset通过获取subComments的长度获取
            subComments: {
              id: content,
              ...
            }
          },
          ...
        }
      },
      ...
    }
