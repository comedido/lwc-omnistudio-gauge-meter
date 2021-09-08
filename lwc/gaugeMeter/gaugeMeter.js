/**
*  @description       : LWC to display a Gauge Meter in OmniScripts or FlexCards 
*  @author            : Aaron Dominguez - aaron.dominguez@salesforce.com
*  @group             : 
*  @last modified on  : 08/09/2021
*  @last modified by  : Aaron Dominguez
*  Modifications Log 
*  Ver   Date         Author            Modification
*  1.0   08/09/2021  Aaron Dominguez   Initial Version
**/

import { LightningElement, track, api } from 'lwc';
import { OmniscriptBaseMixin } from 'vlocity_ins/omniscriptBaseMixin';
import { loadScript } from 'lightning/platformResourceLoader';

export default class GaugeMeter extends OmniscriptBaseMixin(LightningElement) {

    loaded = false;

    @track
    gaugevalue_data;
    @track
    gaugemin_data;
    @track
    gaugemax_data;
    @track
    staticZones_data;
    @track
    staticLabels_data;

    @api
    get gaugevalue() {

        return this.gaugevalue_data;

    }
    set gaugevalue(val) {

        // Note that we get null if there data is not yet present in the OS
        if (val === null) {

            console.log("Got null source data");
            return

        }
        this.gaugevalue_data = val;

    }

    @api
    get gaugemin() {

        return this.gaugemin_data;

    }
    set gaugemin(val) {

        // Note that we get null if there data is not yet present in the OS
        if (val === null) {

            this.gaugemin_data = 0;

        } 
        else
            this.gaugemin_data = val;

    }

    @api
    get gaugemax() {

        return this.gaugemax_data;

    }
    set gaugemax(val) {

        // Note that we get null if there data is not yet present in the OS
        if (val === null) {

            this.gaugemax_data = 100;

        }
        else 
            this.gaugemax_data = val;

    }

    @api
    get staticZones() {

        return this.staticZones_data;

    }
    set staticZones(val) {

        // Note that we get null if there data is not yet present in the OS
        if (val === null) {

            this.staticZones_data = [
                {strokeStyle: "#F03E3E", min: 0, max: 30}, // Red
                {strokeStyle: "#FFDD00", min: 30, max: 60}, // Yellow
                {strokeStyle: "#30B32D", min: 60, max: 100} // Green
             ];

        }
        else 
            this.staticZones_data = val;

    }

    @api
    get staticLabels() {

        return this.staticLabels_data;

    }
    set staticLabels(val) {

        // Note that we get null if there data is not yet present in the OS
        if (val === null) {

            this.staticLabels_data = {
                font: "10px sans-serif",  // Specifies font
                labels: [0, 50, 100],  // Print labels at these values
                color: "#000000",  // Optional: Label text color
                fractionDigits: 0  // Optional: Numerical precision. 0=round off.
              };

        }
        else
            this.staticLabels_data = val;

    }

    //-- LIFECYCLE HOOKS
    renderedCallback() {

        if (this.loaded)
            return
        
        let gaugejs = "/resource/gauge"; //http://bernii.github.io/gauge.js/#!

        Promise.all([
            
            loadScript(this, gaugejs),
        ])
        .then(() => {
            this.loaded = true;
            this.drawChart();
        })
        .catch(error => {
            console.log('The error ', error);
        });

    }

    //-- FUNCTIONS
    drawChart() {
        
        var opts = {
            angle: 0, // The span of the gauge arc
            lineWidth: 0.19, // The line thickness
            radiusScale: 1, // Relative radius
            pointer: {
              length: 0.51, // // Relative to gauge radius
              strokeWidth: 0.046, // The thickness
              color: '#000000' // Fill color
            },
            limitMax: false,     // If false, max value increases automatically if value > maxValue
            //percentColors: [[0.0, "#a9d70b" ], [0.50, "#f9c802"], [1.0, "#ff0000"]],
            staticZones: this.staticZones,
            limitMin: false,     // If true, the min value of the gauge will be fixed
            colorStart: '#6FADCF',   // Colors
            colorStop: '#8FC0DA',    // just experiment with them
            strokeColor: '#E0E0E0',  // to see which ones work best for you
            generateGradient: true,
            highDpiSupport: true,     // High resolution support
            staticLabels: this.staticLabels
        };

        var target = this.template.querySelector('canvas.gauge');
        var gauge = new Gauge(target).setOptions(opts); // create sexy gauge!
        gauge.maxValue = this.gaugemax; // set max gauge value
        gauge.setMinValue(this.gaugemin);  // Prefer setter over gauge.minValue = 0
        gauge.animationSpeed = 46; // set animation speed (32 is default value)
        gauge.set(this.gaugevalue); // set actual value
    }

}