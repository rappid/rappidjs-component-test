rappidjs component tests
===

rappidjs component test is a test runner for executing web tests fast 
within the browser. It contains also a grunt task to run those web tests 
on phantomjs.

rAppid.js makes it easy to hide complexity with components. Most of the components
are visual components that contain beside the business logic (which can be tested 
with unit tests) also an user interface and a data model. As rich applications are
made of a complex hierarchy of components that need to play well together also the 
components itself should be tested.

To make this happen rappidjs component test creates a test runner, which is basically an
a web page with an iframe in it. For every test group a test application containing the 
component is bootstrapped within the iframe and the application and the component is made
available on the window object. Then the test specification is loaded (bdd) and executed 
via mocha within the iframe. As the test has access to the component and also to the 
document 

* it can either change the internal state of the component and check the visual result or
* interacts with the ui and checks the state of the component

A special test reporter with mocha collects the test results and provides it to the 
surrounding page which finally displays the result of all tests. The test runner also
runs on phantomjs, so that the tests can executed headless and fits into a build 
pipeline.

The interaction of with the ui is done via jQuery, the assertion of the component state
with chai and the check of the visual representation via jquery.expect.

GruntTask
---

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the 
[Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create 
a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt 
plugins.
 
Once you're familiar with that process, you may install this plugin with this command:

```
npm install rappidjs-component-test --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this 
line of JavaScript:

``` js
grunt.loadNpmTasks('rappidjs-component-test');
```

This is an example configuration

```
grunt.initConfig({

    componentTest: {
        options: {
            // global options
            port: 8080,
            dir: 'webtest'
        },
        dev: {
            runOnPhantom: false // run it interactive
        },
        test: {
            runOnPhantom: true  // run it headless
        }
    }
```

Writing tests
---

By default all tests and test application within the directory `webtest` in the 
root folder of the project. You can control the directory with the `dir` option 
in the grunt task.

### test groups

Create a groups.json file within the directory with the following structure:

``` json
{
    "all": [
        {
            "app": "AddressComponent.js",
            "test": "AddressComponentTests.js"
        }
    ],
    "testgroup1": [
         {
             "app": "AddressComponent.js",
             "test": "AddressComponentTests.js"
         }, 
         // ... more apps
    ],
    // ... more groups
}
```

### Setup injections

As components can relay on injections, you can create a base TestApplication
which sets up the injections. This is an optional step.

Here you see an BaseTest.xml application inheriting from TestApplication, which 
sets up I18n and an GeolocationService. You can also use mocks here.

``` xml
<test:TestApplication xmlns:test="test" xmlns:js="js.core" xmlns:service="checkout.service">
    <js:Injection>
        <js:I18n />
        <service:GeolocationService />
    </js:Injection>
</test:TestApplication>
```

### Create a component test application

Since the test runner need to bootstrap an application, for every component you like to 
test you need to create an application. This process is simplified by the 
`TestApplication` we're inheriting from. See the following test application

``` js 
define(["xaml!BaseTest", "sprd/model/Address"], function(BaseTest, Address) {

   return BaseTest.inherit({

       componentClass: "checkout/view/Address",

       setupComponent: function(component) {
           component.set("address", new Address());
       }

   });
});
```

the componentClass (not in the defaults section!) defines which component will be created
and added during the start phase of the application. The `setupComponent` method will be 
invoked after the component has been created and is added. If you need an async version of 
if use the following signature `setupComponent: function(component, callback)` and invoke 
the callback when you're done.

### ComponentTest

The component test uses BDD syntax. Chaijs, jQuery and jQuey.expect are available during 
the test, so you can change the UI, check the model or change the model and check the UI.

``` js
define(["sprd/model/Address", "chai"], function(Address, chai) {

    var assert = chai.assert;

    var map = {
        firstname: ".firstname input",
        lastname: ".lastname input"
    };

    function $(what) {
        return jQuery(map[what] || what);
    }

    describe("Address", function () {

        beforeEach(function() {
            component.set("address", new Address());
        });

        it("should have empty fields", function () {
            $expect($("firstname")).to.have.val('');
            $expect($("lastname")).to.have.val('');
        });

        it("should show the person details", function () {
            component.$.address.$.person.set({
                firstName: "first",
                lastName: "last"
            });

            $expect($("firstname")).to.have.val("first");
            $expect($("lastname")).to.have.val("last");
        });

        it("changes in the view should go back into the model", function () {

            assert.isNull(component.get("address.person.salutation"));

            // click on Mr
            $(".salutations input[value='1']").click();

            assert.equal(component.get("address.person.salutation"), "1");

        });
    });

});
```

License
---

MIT