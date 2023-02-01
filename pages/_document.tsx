
import Document, { Html, Head, Main, NextScript } from 'next/document'
import React from 'react'

export default class MyDocument extends Document {

  render() {

    return (
      <Html lang="en">
        <Head />
        <body className = 'bg-gray-600'>
            <Main />
            <NextScript />
        </body>
      </Html>
    )
  }
}