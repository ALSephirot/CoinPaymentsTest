import { Component, OnInit, ApplicationRef } from '@angular/core';
import { CoinPaymentsService } from 'coin-payments-lib/Services/coin-payments.service';
import { CreateTransaction } from 'coin-payments-lib/Models/CreateTransaction';
import { GetTXList } from 'coin-payments-lib/Models/GetTXList';
import { GetTXInfo, GetTXInfoMulti } from 'coin-payments-lib/Models/GetTXInfo';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { LibSettings } from 'coin-payments-lib/app.constants';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Test CoinPayment Integration';
  prueba:string = "";
  transaction:CreateTransaction;
  CreateTransactionForm: FormGroup;
  apikey:string = LibSettings.ApiKey;
  Transactions:any[] = [];

  /**
   *
   */
  constructor(private cps:CoinPaymentsService, private formBuilder:FormBuilder, private appRef:ApplicationRef) {
    cps.TestService("La gran Prueba").then((data:string)=>{
      this.prueba = data;
    });

    this.transaction = new CreateTransaction();

    this.CreateTransactionForm = this.formBuilder.group({
      amount: [0, Validators.compose([Validators.maxLength(40), Validators.required])],
      currency1: ['', Validators.compose([Validators.maxLength(40), Validators.required])],
      currency2: ['', Validators.compose([Validators.maxLength(40), Validators.required])],
      buyer_name: ['', Validators.compose([Validators.maxLength(40)])],
      buyer_email: ['', Validators.compose([Validators.maxLength(40), Validators.required])]
    });

    // this.transaction.amount = 10;
    // this.transaction.currency1 = "USD";
    // this.transaction.currency2 = "BTC";
    // this.transaction.buyer_name = "Luis Oquendo";
    // this.transaction.buyer_email = "asephirotammale@gmail.com";

    
    
  }

  ngOnInit() {
    console.log(JSON.stringify(this.transaction));
    this.loadTransactions();
}

  loadTransactions(){
    this.Transactions = [];
    var getTxList = new GetTXList();

    getTxList.all = 1;
    getTxList.limit = 100;
    getTxList.start = 0;

    this.cps.GetTXList(getTxList).then((data)=>{
      console.log("Transacciones: ",data);
      var txids = "";
      var control = 1;
      data.result.forEach(element => {
        this.loadTransaction(element.txid);
        txids += element.txid;
        if(control < data.result.length){
          txids += " | ";
        }
      });
      console.log("txids: ", txids);
      this.loadMultiTransaction(txids);
    })
  }

  loadTransaction(_txid:string){
    var getTxInfo = new GetTXInfo();

    getTxInfo.full = 1;
    getTxInfo.txid = _txid;

    this.cps.GetTXInfo(getTxInfo).then((data)=>{
      console.log("Transaccion: ",data);
      this.Transactions.push(data);
      console.log("Transaction Model: ", this.Transactions);
    })
  }

  loadMultiTransaction(_txids:string){
    var getTxInfoMulti = new GetTXInfoMulti();
    getTxInfoMulti.txid = _txids;

    this.cps.GetTXInfoMulti(getTxInfoMulti).then((data)=>{
      console.log("Transacciones: ",data);
    })
  }

  save() {
    console.log("Submited Data: ", this.transaction);

    if (this.CreateTransactionForm.valid) {
      this.cps.CreateTransaction(this.transaction).then((data)=>{
        console.log("Transaction: ", data);
        this.loadTransactions();
      },(error)=>{
        console.log("Error: ", error);
      })
    } else {
      //hacer algo cuando no es valido el formulario
      console.log("Form invalido: ", this.CreateTransactionForm);
    }
  }
}
