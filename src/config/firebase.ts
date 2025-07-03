// Temporary mock Firebase implementation
export const db = {
  collection: (collectionName: string) => ({
    doc: (id: string) => ({
      get: async () => ({
        exists: true,
        id: id,
        data: () => ({
          name: 'Test User',
          email: 'test@example.com',
          status: 'active',
          updatedAt: {
            toDate: () => new Date()
          },
          createdAt: {
            toDate: () => new Date()
          },
          nim: '123456',
          prodi: 'Informatika',
          noHp: '081234567890',
          divisionId: 'div1',
          isActive: true,
          currentRegistered: 0,
          quota: 100,
          deadline: {
            toDate: () => new Date()
          }
        })
      }),
      update: async (data: any) => {},
      delete: async () => {}
    }),
    get: async () => ({
      docs: [{
        id: '1',
        data: () => ({
          name: 'Test User',
          email: 'test@example.com',
          status: 'active',
          updatedAt: {
            toDate: () => new Date()
          },
          createdAt: {
            toDate: () => new Date()
          },
          nim: '123456',
          prodi: 'Informatika',
          noHp: '081234567890',
          divisionId: 'div1',
          isActive: true,
          currentRegistered: 0,
          quota: 100,
          deadline: {
            toDate: () => new Date()
          }
        })
      }]
    }),
    where: (field: string, operator: string, value: any) => ({
      get: async () => ({
        docs: [{
          id: '1',
          data: () => ({
            name: 'Test User',
            email: 'test@example.com',
            status: 'active',
            updatedAt: {
              toDate: () => new Date()
            },
            createdAt: {
              toDate: () => new Date()
            },
            nim: '123456',
            prodi: 'Informatika',
            noHp: '081234567890',
            divisionId: 'div1'
          })
        }]
      })
    }),
    add: async (data: any) => ({
      id: 'new-id',
      get: async () => ({
        exists: true,
        data: () => data
      })
    })
  })
};

export const firestore = db;
export const auth = {
  // Mock auth methods if needed
};

export default {
  apps: [],
  initializeApp: () => {}
};
