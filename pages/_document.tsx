
import Document, { Html, Head, Main, NextScript } from 'next/document'
import React from 'react'

export default class MyDocument extends Document {

  render() {

    return (
      <Html lang="en">
        <Head />
        <body className = 'bg-white'>
            <Main />
            <NextScript />
        </body>
      </Html>
    )
  }
}