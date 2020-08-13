let paymentRequestResponder;
let paymentRequestEvent;
let methodName;

self.addEventListener('canmakepayment', function(evt) {
  evt.respondWith(true);
});

self.addEventListener('abortpayment', function(evt) {
  console.log("payment is aborted");
  evt.respondWith(true);
});

self.addEventListener('message', (evt) => {
  // Sent from the Payment app.
  if (evt.data === 'confirm') {
    paymentRequestResponder({methodName, details: {status: 'success'}});
    return;
  } else if (evt.data === 'reject') {
    paymentRequestResponder({methodName, details: {status: 'fail'}});
    return;
  } else if (evt.data === 'cancel') {
    paymentRequestResponder({methodName, details: {status: 'unknown'}});
    return;
  }
});

self.addEventListener('paymentrequest', (evt) => {
  paymentRequestEvent = evt;
  methodName = evt.methodData[0].supportedMethods;
  evt.respondWith(new Promise((responder) => {
    paymentRequestResponder = responder;
    evt.openWindow('confirm.html').then((windowClient) => {
      if (!windowClient)
        paymentRequestResponder({methodName, details: {status: 'fail'}});
      windowClient.postMessage('windowClient is able to post message.');
    }).catch((error) => {
      paymentRequestResponder({methodName, details: {status: 'fail', message: error.message}});
    });
  }));
});