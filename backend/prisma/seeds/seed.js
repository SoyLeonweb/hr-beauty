const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function main() {
  // Categorías
  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: 'hidratacion' },  update: {}, create: { name: 'Hidratación',   slug: 'hidratacion'  } }),
    prisma.category.upsert({ where: { slug: 'maquillaje' },   update: {}, create: { name: 'Maquillaje',    slug: 'maquillaje'   } }),
    prisma.category.upsert({ where: { slug: 'cuidado-solar' },update: {}, create: { name: 'Cuidado Solar', slug: 'cuidado-solar' } }),
    prisma.category.upsert({ where: { slug: 'serum' },        update: {}, create: { name: 'Sérum',         slug: 'serum'         } }),
  ])

  // Admin user
  await prisma.user.upsert({
    where: { email: 'admin@hrbeauty.com' },
    update: {},
    create: { name: 'Admin', email: 'admin@hrbeauty.com', password: await bcrypt.hash('Admin1234!', 12), role: 'ADMIN' }
  })

  console.log('✅ Seed completado')
}

main().catch(console.error).finally(() => prisma.$disconnect())
