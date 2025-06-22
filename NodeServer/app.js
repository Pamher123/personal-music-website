import express from 'express';
import cors from 'cors';   
import db from './mysql.js';
import multer from 'multer'
import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let latestImage = null;         // 用于保存最新图像
let clients = [];               // 用于保存连接的客户端列表




const app = express();
const port = 8000;

app.use(cors({
  origin: 'http://localhost:8080'
}));
app.use(express.static('public'));
app.use(express.json());

app.use(express.urlencoded({
    extended: false
}));


//====================用户相关API=======================

//登录
app.post('/login', (req, res) => {
    console.log('收到登录请求，body:', req.body);
    const { username, password } = req.body;

    // 数据库中查询
    const sql = 'SELECT * FROM usersNya WHERE username = ? AND password = ?';

    db.querySql(sql, [username, password], (err, results) => {
        if (err) 
          {
            console.error('数据库查询出错:', err);
            res.json({ code: 500, msg: '数据库错误' });
        } 
        else if (results.length > 0) 
      {
            // 查询到用户，返回用户信息，包括admin字段
        const user = results[0];
        res.json
        (
          { 
            code: 200, 
            msg: '登录成功', 
            user: 
            {
              id:user.id,
              username: user.username,
              admin: user.admin,   // 假设字段是 admin
            }
          }
        );
      }
        else 
        {
            res.json({ code: 201, msg: '登录失败，用户名或密码错误' });
        }
    });
});

//获取全部用户
app.get('/users', (req, res) => {
  const sql = 'SELECT * FROM usersNya';
  db.querySql(sql, [], (err, results) => {
    if (err) {
      res.json({ code: 500, data: null, message: err.sqlMessage });
    } else {
      res.json({ code: 200, data: results, message: '成功' });
    }
  });
});

//通过ID获取用户
app.get('/user/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'SELECT * FROM usersNya WHERE id = ?';
  db.querySql(sql, [id], (err, results) => {
    if(err) {
      res.json({ code: 500, data: null, message: err.sqlMessage });
    } else {
      if(results.length > 0){
        res.json({ code: 200, data: results[0], message: '成功' });
      } else {
        res.json({ code: 404, data: null, message: '用户不存在' });
      }
    }
  });
});

//注册
app.post('/register', function(req, res, next) {
   
    let username = req.body.data.username;
    let password = req.body.data.password;
    let sex = req.body.data.sex;
    let age = req.body.data.age;

   
    let sql = `INSERT INTO usersNya (username, password, sex, age) VALUES ('${username}', '${password}', '${sex}', ${age})`;

    db.querySql(sql, [], function(err, results) {
        if (err) {
            res.json({ code: 500, data: null, message: err.sqlMessage });
        } else {
            res.json({ code: 200, data: results, message: '注册成功！' });
        }
    });
});

//删除
app.post('/del', (req, res) => {
    const id = req.body.data.id;
    const sql = 'DELETE FROM usersNya WHERE id = ?';

    db.querySql(sql, [id], (err, results) => {
        if (err) {
            res.json({ code: 500, data: null, message: err.sqlMessage });
        } else {
            res.json({ code: 200, data: results, message: '删除成功！' });
        }
    });
});

//更新
app.post('/update', function(req, res, next) {
  const data = req.body.data;
  if (!data || !data.id) {
    return res.json({ code: 400, data: null, message: '缺少用户ID' });
  }

  const { id, username, sex, age, password } = data;

  // 更新字段
  let sql = 'UPDATE usersNya SET username=?, sex=?, age=?';
  const params = [username, sex, age];

  if (password) {
    sql += ', password=?';
    params.push(password);
  }

  sql += ' WHERE id=?';
  params.push(id);

  db.querySql(sql, params, function(err, results) {
    if (err) {
      res.json({ code: 500, data: null, message: err.sqlMessage });
    } else {
      res.json({ code: 200, data: results, message: '更新成功' });
    }
  });
});
//====================用户相关API=======================


// ==================== 商品相关API ====================
// 获取所有商品
app.get('/items', (req, res) => {
  const sql = 'SELECT * FROM items ORDER BY created_at DESC';
  
  db.querySql(sql, [], (err, results) => {
    if (err) {
      console.error('获取商品列表失败:', err);
      res.json({
        code: 500,
        data: null,
        message: '获取商品列表失败'
      });
    } else {
      res.json({
        code: 200,
        data: results,
        message: '获取商品列表成功'
      });
    }
  });
});

// 根据ID获取单个商品
app.get('/items/:id', (req, res) => {
  const { id } = req.params;
  const sql = 'SELECT * FROM items WHERE id = ?';
  
  db.querySql(sql, [id], (err, results) => {
    if (err) {
      console.error('获取商品详情失败:', err);
      res.json({
        code: 500,
        data: null,
        message: '获取商品详情失败'
      });
    } else if (results.length === 0) {
      res.json({
        code: 404,
        data: null,
        message: '商品不存在'
      });
    } else {
      res.json({
        code: 200,
        data: results[0],
        message: '获取商品详情成功'
      });
    }
  });
});

// 添加新商品
app.post('/items', (req, res) => {
  const { name, price, bpm, genre, duration, preview, description, image } = req.body;
  
  // 验证必填字段
  if (!name || !price) {
    return res.json({
      code: 400,
      data: null,
      message: '商品名称和价格不能为空'
    });
  }
  
  const sql = `INSERT INTO items (name, price, bpm, genre, duration, preview, description, image) 
               VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  const params = [name, price, bpm, genre, duration, preview, description, image];
  
  db.querySql(sql, params, (err, results) => {
    if (err) {
      console.error('添加商品失败:', err);
      res.json({
        code: 500,
        data: null,
        message: '添加商品失败'
      });
    } else {
      res.json({
        code: 200,
        data: {
          id: results.insertId,
          name,
          price,
          bpm,
          genre,
          duration,
          preview,
          description,
          image
        },
        message: '添加商品成功'
      });
    }
  });
});

// 更新商品
app.post('/items/update', (req, res) => {
  const { id, name, price, bpm, genre, duration, preview, description, image } = req.body;
  
  // 验证必填字段
  if (!id || !name || !price) {
    return res.json({
      code: 400,
      data: null,
      message: '商品ID、名称和价格不能为空'
    });
  }
  
  const sql = `UPDATE items SET name = ?, price = ?, bpm = ?, genre = ?, 
               duration = ?, preview = ?, description = ?, image = ?, updated_at = CURRENT_TIMESTAMP 
               WHERE id = ?`;
  const params = [name, price, bpm, genre, duration, preview, description, image, id];
  
  db.querySql(sql, params, (err, results) => {
    if (err) {
      console.error('更新商品失败:', err);
      res.json({
        code: 500,
        data: null,
        message: '更新商品失败'
      });
    } else if (results.affectedRows === 0) {
      res.json({
        code: 404,
        data: null,
        message: '商品不存在'
      });
    } else {
      res.json({
        code: 200,
        data: {
          id,
          name,
          price,
          bpm,
          genre,
          duration,
          preview,
          description,
          image
        },
        message: '更新商品成功'
      });
    }
  });
});

//============图片/音频上传api==================



// 图片上传配置
const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/images')
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname)
    const filename = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext
    cb(null, filename)
  }
})
const uploadImage = multer({ storage: imageStorage })

// 音频上传配置
const audioStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/audios')
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname)
    const filename = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext
    cb(null, filename)
  }
})
const uploadAudio = multer({ storage: audioStorage })

// 提供静态访问
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')))

// 图片上传接口
app.post('/upload/image', uploadImage.single('file'), (req, res) => {
  const fileUrl = `/uploads/images/${req.file.filename}`
  res.json({
    code: 200,
    url: fileUrl,
    message: '图片上传成功'
  })
})

// 音频上传接口
app.post('/upload/audio', uploadAudio.single('file'), (req, res) => {
  const fileUrl = `/uploads/audios/${req.file.filename}`
  res.json({
    code: 200,
    url: fileUrl,
    message: '音频上传成功'
  })
})
//============图片/音频上传api==================

// 删除商品
app.post('/items/delete', (req, res) => {
  const { id } = req.body;
  
  if (!id) {
    return res.json({
      code: 400,
      data: null,
      message: '商品ID不能为空'
    });
  }
  
  const sql = 'DELETE FROM items WHERE id = ?';
  
  db.querySql(sql, [id], (err, results) => {
    if (err) {
      console.error('删除商品失败:', err);
      res.json({
        code: 500,
        data: null,
        message: '删除商品失败'
      });
    } else if (results.affectedRows === 0) {
      res.json({
        code: 404,
        data: null,
        message: '商品不存在'
      });
    } else {
      res.json({
        code: 200,
        data: null,
        message: '删除商品成功'
      });
    }
  });
});

// 批量删除商品
app.post('/items/batchDelete', (req, res) => {
  const { ids } = req.body;
  
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.json({
      code: 400,
      data: null,
      message: '请提供要删除的商品ID数组'
    });
  }
  
  const placeholders = ids.map(() => '?').join(',');
  const sql = `DELETE FROM items WHERE id IN (${placeholders})`;
  
  db.querySql(sql, ids, (err, results) => {
    if (err) {
      console.error('批量删除商品失败:', err);
      res.json({
        code: 500,
        data: null,
        message: '批量删除商品失败'
      });
    } else {
      res.json({
        code: 200,
        data: {
          deletedCount: results.affectedRows
        },
        message: `成功删除 ${results.affectedRows} 个商品`
      });
    }
  });
});

// 搜索商品
app.get('/items/search/:keyword', (req, res) => {
  const { keyword } = req.params;
  const sql = `SELECT * FROM items 
               WHERE name LIKE ? OR genre LIKE ? OR description LIKE ? 
               ORDER BY created_at DESC`;
  const searchTerm = `%${keyword}%`;
  
  db.querySql(sql, [searchTerm, searchTerm, searchTerm], (err, results) => {
    if (err) {
      console.error('搜索商品失败:', err);
      res.json({
        code: 500,
        data: null,
        message: '搜索商品失败'
      });
    } else {
      res.json({
        code: 200,
        data: results,
        message: '搜索完成',
        count: results.length
      });
    }
  });
});

// 测试数据库连接
app.get('/test-db', (req, res) => {
  db.querySql('SELECT 1 + 1 AS result', [], (err, results) => {
    if (err) {
      res.json({
        code: 500,
        data: null,
        message: '数据库连接失败'
      });
    } else {
      res.json({
        code: 200,
        data: results[0],
        message: '数据库连接成功'
      });
    }
  });
});

// 根据价格区间搜索
app.get('/items/price', (req, res) => {
  const { min, max } = req.query;
  const sql = 'SELECT * FROM items WHERE price BETWEEN ? AND ?';
  db.querySql(sql, [min, max], (err, results) => {
    if (err) {
      console.error('价格搜索失败:', err);
      res.json({ code: 500, data: null, message: '搜索失败' });
    } else {
      res.json({ code: 200, data: results });
    }
  });
});

// 根据BPM区间搜索
app.get('/items/bpm', (req, res) => {
  const { min, max } = req.query;
  const sql = 'SELECT * FROM items WHERE bpm BETWEEN ? AND ?';
  db.querySql(sql, [min, max], (err, results) => {
    if (err) {
      console.error('BPM搜索失败:', err);
      res.json({ code: 500, data: null, message: '搜索失败' });
    } else {
      res.json({ code: 200, data: results });
    }
  });
});


//=================日志测试====================================
// app.listen(port, () => {
//   console.log(`Server is running at http://localhost:${port}`);
//   console.log('可用的商品API:');
//   console.log('  GET  /items              - 获取所有商品');
//   console.log('  GET  /items/:id          - 获取单个商品');
//   console.log('  POST /items              - 添加商品');
//   console.log('  POST /items/update       - 更新商品');
//   console.log('  POST /items/delete       - 删除商品');
//   console.log('  POST /items/batchDelete  - 批量删除商品');
//   console.log('  GET  /items/search/:keyword - 搜索商品');
// });
//=================日志测试====================================

//======================为ESP32提供的API========================
// 接收 ESP32 上传的图片
app.post('/upload', (req, res) => {
    let data = [];

    req.on('data', chunk => data.push(chunk));
    req.on('end', () => {
        const image = Buffer.concat(data);
        const filename = `image_${Date.now()}.bmp`;

        const sql = "INSERT INTO camera_images (image, filename) VALUES (?, ?)";
        db.querySql(sql, [image, filename], (err, results) => {
            if (err) {
                console.error('数据库插入失败:', err);
                return res.status(500).send('数据库错误');
            }
            res.sendStatus(200);
        });
    });
});

// 提供图片列表给网页
app.get('/images', (req, res) => {
    const sql = "SELECT id, timestamp, TO_BASE64(image) AS image FROM camera_images ORDER BY id DESC";
    db.querySql(sql, null, (err, results) => {
        if (err) {
            console.error('查询失败:', err);
            return res.status(500).send('查询失败');
        }
        res.json(results);
    });
});
// =======================获取 sensor_readings 数据=============================
// 修改后的Node.js API - 返回对象格式而不是数组
app.get('/api/sensor-data', (req, res) => {
  const sql = 'SELECT light, distance, timestamp FROM sensor_readings ORDER BY id DESC LIMIT 1';


  db.querySql(sql, (err, results) => {
    if (err) {
      console.error('查询出错:', err);
      return res.status(500).json({ error: '数据库查询失败' });
    }

    console.log('查询结果：', results);

    if (!results || results.length === 0) {
      return res.json({
        distance: null,
        light: null,
        timestamp: new Date().toISOString(),
        message: '暂无传感器数据'
      });
    }

    // ✅ 只取最新一条
    const latestData = results[0];

    const responseData = {
      temperature: latestData.distance || 0,
      light: latestData.light || 0,
      timestamp: latestData.timestamp || new Date().toISOString()
    };

    console.log('返回给前端的数据：', responseData);
    res.json(responseData);
  }); // ✅ 这是 querySql 的结尾

}); // ✅ ❗这是 app.get 的结尾，之前你漏掉了

// =======================获取 sensor_readings 数据=============================

// 接收ESP32的流数据
app.post('/stream-upload', (req, res) => {
  let imageData = Buffer.alloc(0);
  
  req.on('data', (chunk) => {
    imageData = Buffer.concat([imageData, chunk]);
  });
  
  req.on('end', () => {
    latestImage = imageData;
    
    // 向所有连接的客户端发送新图片
    clients.forEach(client => {
      if (!client.destroyed) {
        client.write(`--frame\r\n`);
        client.write(`Content-Type: image/bmp\r\n`);
        client.write(`Content-Length: ${imageData.length}\r\n\r\n`);
        client.write(imageData);
        client.write(`\r\n`);
      }
    });
    
    res.sendStatus(200);
  });
});

// 提供实时流
app.get('/stream', (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'multipart/x-mixed-replace; boundary=frame',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  });
  
  clients.push(res);
  
  // 如果有最新图片，立即发送
  if (latestImage) {
    res.write(`--frame\r\n`);
    res.write(`Content-Type: image/bmp\r\n`);
    res.write(`Content-Length: ${latestImage.length}\r\n\r\n`);
    res.write(latestImage);
    res.write(`\r\n`);
  }
  
  // 清理断开的连接
  res.on('close', () => {
    const index = clients.indexOf(res);
    if (index > -1) {
      clients.splice(index, 1);
    }
  });
});
//======================为ESP32提供的API========================

app.listen(8000, '0.0.0.0', () => {
  console.log("Server is running at http://localhost:8000...");
});