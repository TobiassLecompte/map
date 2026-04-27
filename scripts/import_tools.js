const fs = require('fs');
const path = require('path');

// 配置文件路径
const templatePath = path.join(__dirname, '../工具收录模板.md');
const dbPath = path.join(__dirname, '../src/data/tools.json');

// 解析 Markdown 表格的辅助函数
function parseMarkdownTable(markdownContent) {
  const lines = markdownContent.split('\n');
  const items = [];
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    // 判断是否是表格行 (以 | 开头并以 | 结尾)
    if (trimmedLine.startsWith('|') && trimmedLine.endsWith('|')) {
      // 按照 | 分割并去除多余的空白
      // 例如: | 网站名称 | 简介 | -> ['', ' 网站名称 ', ' 简介 ', '']
      const columns = trimmedLine.split('|').map(col => col.trim());
      
      // 移除首尾的空字符串
      columns.shift();
      columns.pop();
      
      // 检查列数是否符合要求且不是表头或分隔线
      if (columns.length >= 5) {
        const name = columns[0];
        // 过滤掉表头、分隔线以及模板里的"例："
        if (name.includes('网站名称') || name.includes('---') || name.startsWith('例：') || name === '') {
          continue;
        }
        
        items.push({
          name: name,
          description: columns[1] || '',
          url: columns[2] || '',
          categoryId: columns[3] || '',
          icon: columns[4] || ''
        });
      }
    }
  }
  
  return items;
}

async function main() {
  try {
    console.log('🚀 开始解析模板数据...\n');

    // 1. 读取文件
    if (!fs.existsSync(templatePath)) {
      console.error(`❌ 找不到模板文件: ${templatePath}`);
      return;
    }
    const templateContent = fs.readFileSync(templatePath, 'utf8');
    
    if (!fs.existsSync(dbPath)) {
      console.error(`❌ 找不到数据库文件: ${dbPath}`);
      return;
    }
    const dbContent = fs.readFileSync(dbPath, 'utf8');
    const db = JSON.parse(dbContent);
    
    // 2. 从 Markdown 解析新项目
    const newItems = parseMarkdownTable(templateContent);
    if (newItems.length === 0) {
      console.log('⚠️ 在模板中没有找到新的有效数据，请确保已经填写了表格。');
      return;
    }
    
    let addedCount = 0;
    let skippedCount = 0;
    
    // 找到当前最大的 ID
    let maxId = 0;
    for (const tool of db.tools) {
      const idNum = parseInt(tool.id, 10);
      if (!isNaN(idNum) && idNum > maxId) {
        maxId = idNum;
      }
    }

    // 3. 逐个处理新项目
    for (const item of newItems) {
      // 如果没有填写网站名或URL，则跳过
      if (!item.name || !item.url) continue;
      
      // 【判断重复】通过 URL 或 网站名称进行判重
      const isDuplicate = db.tools.some(t => 
        t.url.toLowerCase() === item.url.toLowerCase() || 
        t.name.toLowerCase() === item.name.toLowerCase()
      );
      
      if (isDuplicate) {
        console.log(`[跳过] 已存在重复项: ${item.name} (${item.url})`);
        skippedCount++;
        continue;
      }
      
      // 分配新的 ID
      maxId++;
      
      // 整理新的工具数据结构
      const newTool = {
        id: maxId.toString(),
        name: item.name,
        description: item.description,
        categoryId: item.categoryId.toLowerCase(),
        url: item.url,
        icon: item.icon
      };
      
      db.tools.push(newTool);
      console.log(`[添加] 新增工具: ${item.name}`);
      addedCount++;
    }
    
    // 4. 更新分类中的工具数量统计 (count)
    if (addedCount > 0) {
      db.categories.forEach(cat => {
        const count = db.tools.filter(t => t.categoryId === cat.id).length;
        cat.count = count;
      });
      
      // 5. 将更新后的数据保存回 JSON 文件
      fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
      console.log(`\n✅ 更新完成！成功添加 ${addedCount} 个工具，跳过 ${skippedCount} 个重复工具。`);
    } else {
      console.log(`\n🎉 运行结束。没有新工具需要添加 (跳过了 ${skippedCount} 个重复工具)。`);
    }
    
  } catch (error) {
    console.error('❌ 发生错误:', error);
  }
}

main();
