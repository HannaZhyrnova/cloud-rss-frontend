import './App.css';
import React, { useState } from 'react'
import {timeout} from "q";

const BACKEND_URL = "http://localhost:8080"

const SAVE_EMAIL_RSS_EMAILS = BACKEND_URL + "/email/rss"

const GET_MAIL_HTML_CONTENT = BACKEND_URL + "/email/preview?email="

const SEND_EMAIL = BACKEND_URL + "/email/send?email="


function App() {

  const [emailHtmlContent, setEmailHtmlContent] = useState("")
  const [rssUrls, setRssUrls] = useState([])
  const [rssUrl, setRssUrl] = useState("")
  const [email, setEmail] = useState("")
  const [statusText, setStatusText] = useState("")

  const onClickSave = () => {
    fetch(SAVE_EMAIL_RSS_EMAILS, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        rssUrls
      })
    }).then(() => setStatus("Changes were saved successfully"))
      .catch(() => setStatus("Failed to save changes"))
  }

  const onClickPreview = () => {
    fetch(GET_MAIL_HTML_CONTENT + email)
      .then(response => response.text())
      .then(emailHtmlContent => {
        setEmailHtmlContent(emailHtmlContent)
      })
      .catch(() => setStatus("Failed to get email preview"))

  }

  const onClickSend = () => {
    fetch(SEND_EMAIL + email)
      .then(() => setStatus("Email was sent successfully"))
      .catch(() => setStatus("Failed to send email"))
  }

  const setStatus = (message) => {
    setStatusText(message)
  }


  const onClickAddRssUrl = () => {
    rssUrls.push(rssUrl)
    setRssUrls(rssUrls)
    setRssUrl("")
  }

  const onChangeRssUrlInput = (e) => {
    setRssUrl(e.target.value)
  }

  const onChangeEmailInput = (e) => {
    setEmail(e.target.value)
  }

  return (
    <div className="wrapper">
      <div className="headerContainer">
        <div>{statusText}</div>
        <button onClick={onClickSave}>Save</button>
        <button onClick={onClickPreview}>Preview</button>
        <button onClick={onClickSend}>Send</button>
      </div>
      <div className="row">
        <div className="column">
          <div>Email Address</div>
          <input value={email} onChange={onChangeEmailInput} type="email"/>
          <iframe id="rssEmailPreviewIFrame" srcDoc={emailHtmlContent}/>
        </div>
        <div className="column">
          <div>RSS URLs</div>
          <div className="rssInputContainer">
            <input value={rssUrl} onChange={onChangeRssUrlInput} type="text" className="rssInput"/>
            <button onClick={onClickAddRssUrl}>Add</button>
          </div>
          {rssUrls.map(url => <div>{url}</div>)}
        </div>
      </div>
    </div>
  )
}

export default App;
