import { PrismaClient } from '@prisma/client'
import { parse } from 'csv-parse/sync'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient()
const supplierId = '5941c2b7-92d2-47c4-b1e7-52511c8d0c7f'

// Load and parse CSV
const filePath = './retail_store_inventory.csv'
const content = fs.readFileSync(filePath)
const records = parse(content, {
  columns: true,
  skip_empty_lines: true
})

// Deduplicate by Product ID
const seen = new Set()
const inventoryData = []

for (const row of records) {
  const productId = row['Product ID']
  if (!seen.has(productId)) {
    seen.add(productId)
    inventoryData.push({
      id: uuidv4(),
      name: productId,
      quantityAvailable: parseInt(row['Inventory Level'], 10),
      pricePerUnit: parseFloat(row['Price']),
      unit: 'units',
      category: row['Category'],
      sustainabilityHash: null,
      supplierId
    })
  }
}

// Insert into DB
const main = async () => {
  for (const item of inventoryData) {
    await prisma.inventoryItem.create({ data: item })
    console.log(`Inserted ${item.name}`)
  }
  await prisma.$disconnect()
}

main().catch(e => {
  console.error(e)
  prisma.$disconnect()
  process.exit(1)
})
