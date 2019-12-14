"use strict";
const LOG_ON = true //error logging
const LOG_FREQ = 20000 //error log in iterations
class NeuralNetwork{
    constructor(numInputs,numHidden,numOutputs){
        this._hidden = [];
        this._inputs = [];
        this._numInputs = numInputs;
        this._numHidden = numHidden;
        this._numOutputs  = numOutputs;
        this._bias0 = new Matrix(1,this._numHidden);
        this._bias1 = new Matrix(1,this._numOutputs);
        this._weights0 = new Matrix(this._numInputs,this._numHidden);
        this._weights1 = new Matrix(this._numHidden,this._numOutputs);

        //erroe logging
        this._logCount = LOG_FREQ;
        //randomize the initial weights
        this._bias0.randomWeights();
        this._bias1.randomWeights();
        
        this._weights0.randomWeights();
        this.weights1.randomWeights();

    }
    get inputs (){
        return this._inputs ;
    }

    set inputs (inputs ){
        this._inputs  = inputs ;
    }
    get hidden(){
        return this._hidden;
    }

    set hidden(hidden){
        this._hidden = hidden;
    }
    get bias0(){
        return this._bias0;
    }

    set bias0(bias){
        this._bias0 =bias;
    }
    get bias1(){
        return this._bias1;
    }

    set bias1(bias){
        this._bias1 =bias;
    }
    get weights0(){
        return this._weights0;
    }

    set weights0(weights){
        this._weights0 = weights;
    }

    get weights1(){
        return this._weights1;
    }

    set weights1(weights){
        this._weights1 = weights;
    }
    get logCount(){
        return this._logCount;
    }

    set logCount(count){
        this._logCount= count;
        
    }
   
//Feed forward
    feedForward(inputArray){
        //converting input array to a matrix
        this.inputs = Matrix.convertFromArray(inputArray);
       

        
        //find the hidden values
        this.hidden  = Matrix.dot(this.inputs,this.weights0);
       
        this.hidden = Matrix.add(this.hidden,this.bias0)//application of bias
       this.hidden = Matrix.map(this.hidden,x => sigmoid(x));
       


        //find the output values
        let outputs  = Matrix.dot(this.hidden,this.weights1);
        outputs = Matrix.add(outputs,this.bias1)//apply bias
        outputs = Matrix.map(outputs,x => sigmoid(x));
        
        return outputs;
    }
    train(inputArray,targetArray){
        //feed the input data in network
        let outputs = this.feedForward(inputArray);
        // console.log("outputs");
        // console.table(outputs.data);

        // //calculate the output errors(target - output)
        
        let targets = Matrix.convertFromArray(targetArray);
        // console.log("targets");
        // console.table(targets.data);
        let outputErrors = Matrix.subtract(targets,outputs);
        // console.log("outputErrors");
        // console.table(outputErrors.data);
        
        //error logging
        if(LOG_ON){
            if(this.logCount == LOG_FREQ){
                console.log("error = "+outputErrors.data[0][0]);
                
            }
            this.logCount--;
            if(this.logCount ==0){
                this.logCount = LOG_FREQ;
            }
        }

        //calculate the deltas(errors *derivatives of outputs)
        let outputDerivs = Matrix.map(outputs,x => sigmoid(x,true));
        let outputDeltas = Matrix.multiply(outputErrors,outputDerivs);
        // console.log("outputDeltas");
        // console.table(outputDeltas.data);

        //calulate the hiddden layer errors(delts "dot " transpose of weights)
        let weights1T = Matrix.transpose(this.weights1);
        let hiddenErrors = Matrix.dot(outputDeltas,weights1T);
        // console.log("hiddenErrors");
        // console.table(hiddenErrors.data);

        //calculate hidden deltas(errors *derivatives of hidden)
        let hiddenDerivs = Matrix.map(this.hidden,x => sigmoid(x,true));
        let hiddenDeltas = Matrix.multiply(hiddenErrors,hiddenDerivs);
        // console.log("hiddenDeltas");
        // console.table(hiddenDeltas.data);

        //update the weights(add transpose of layer of 'dot 'deltas)
        let hiddenT = Matrix.transpose(this.hidden);
        this.weights1 = Matrix.add(this.weights1,Matrix.dot(hiddenT,outputDeltas));
        let inputsT = Matrix.transpose(this.inputs);
        this.weights0 = Matrix.add(this.weights0,Matrix.dot(inputsT,hiddenDeltas));
        
        //update bias
        this.bias1 = Matrix.add(this.bias1,outputDeltas);
        this.bias0 = Matrix.add(this.bias0,hiddenDeltas);
    }
    

}
function sigmoid(x,deriv = false){
    if(deriv){
        return x*(1-x); //where x = sigmoid(x)
    }
    return 1/(1+Math.exp(-x));
}