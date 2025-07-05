import { PrismaClient } from '@prisma/client'
import { parse } from 'csv-parse/sync'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'

const prisma = new PrismaClient()

function getRandomTime() {
  const hour = Math.floor(Math.random() * 12) + 8  // 08 to 19
  const minute = Math.floor(Math.random() * 60)
  const second = Math.floor(Math.random() * 60)
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:${second.toString().padStart(2, '0')}`
}

// Read and parse CSV
const content = fs.readFileSync('./retail_store_inventory.csv')
const records = parse(content, {
  columns: true,
  skip_empty_lines: true
})

// Map product name → itemId from InventoryItem
const productToItemId = {}
const inventoryItems = await prisma.inventoryItem.findMany()
inventoryItems.forEach(item => {
  productToItemId[item.name] = item.id
})

// Build transactions
const transactions = []

for (const row of records) {
  const itemId = productToItemId[row['Product ID']]
  if (!itemId) continue

  const randomTime = getRandomTime()
  const dateTime = new Date(`${row['Date']}T${randomTime}`)

  transactions.push({
    id: uuidv4(),
    invoiceId: row['Invoice ID'],
    date: dateTime,
    time: randomTime,
    itemId,
    quantitySold: parseInt(row['Units Sold']),
    storeBranch: row['Store ID'],
    city: row['Region'],
    customerType: row['Customer type'],
    payment: row['Payment'],
    unitPrice: parseFloat(row['Price']),
    total: parseFloat(row['Price']) * parseInt(row['Units Sold']),
    rating: row['Rating'] ? parseFloat(row['Rating']) : null
  })
}

// Insert in chunks
const main = async () => {
  for (const tx of transactions) {
    await prisma.salesTransaction.create({ data: tx })
    console.log(`Inserted transaction ${tx.invoiceId}`)
  }
  await prisma.$disconnect()
}

main().catch(e => {
  console.error(e)
  prisma.$disconnect()
  process.exit(1)
})
