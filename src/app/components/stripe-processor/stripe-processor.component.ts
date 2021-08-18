import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {loadStripe} from '@stripe/stripe-js';

@Component({
  selector: 'app-stripe-processor',
  templateUrl: './stripe-processor.component.html',
  styleUrls: ['./stripe-processor.component.scss']
})
export class StripeProcessorComponent implements OnInit {

  @Output() tokenGenerated = new EventEmitter<any>();

  style = {
    base: {
      color: '#ffffff',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4'
      }
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a'
    }
  };

  

  stripe = Stripe('pk_test_51JJl3jLlJEov7K7AyyqlQbscQDv6zVkjqERECcZ5bmckAahdfxYCqLxQtQ5JTmn6uYLmuPftZEIdOeBAM2nzWKAW00sQxLYldQ');
  elements = this.stripe.elements();

  card = this.elements.create('card', {style: this.style});

  constructor() { }

  ngOnInit(): void {
    

    
    // Add an instance of the card UI component into the `card-element`
    this.card.mount('#card-element');

    this.card.addEventListener('change',(event)=>{
      var displayError = document.getElementById('card-errors');
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }
    });

    
    // Create a token when the form is submitted.
    var form = document.getElementById('payment-form');
    form.addEventListener('submit',(event)=>{
      event.preventDefault();
      this.createToken();
    });
  

  }

 

  createToken() {
    this.stripe.createToken(this.card).then((result)=>{
      if (result.error) {
        // Inform the user of error
        var errorElement = document.getElementById('card-errors');
        errorElement.textContent = result.error.message;
        
      } else {
        console.log(result.token);
        
        this.tokenGenerated.emit(result.token);
        //stripeTokenHandler(result.token);
      }
    });
  };
  
}
