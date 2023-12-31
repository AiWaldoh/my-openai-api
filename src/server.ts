import express from 'express'

export const startServer = (
  app: express.Express,
  port: number | string = process.env.PORT || 3001
) => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`)
  })
}
