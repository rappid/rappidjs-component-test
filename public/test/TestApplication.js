define(["js/core/Application", "js/core/ExternalInterface", "flow", "require"], function (Application, ExternalInterface, flow, require) {
    return Application.inherit({

        inject: {
            externalInterface: ExternalInterface
        },

        hooks: {
        },

        setupComponent: function (component, callback) {
            callback && callback();
        },

        start: function (parameter, callback) {

            var externalInterface = this.$.externalInterface;

            var hooks = this.hooks;
            for (var hook in hooks) {
                if (hooks.hasOwnProperty(hook)) {
                    externalInterface.addCallback(hook, hooks[hook], this);
                }
            }

            var stage = this.$stage,
                componentClass = this.componentClass,
                component = null,
                self = this;

            if (componentClass) {
                flow()
                    .seq(function (cb) {
                        require([stage.$applicationContext.getFqClassName(componentClass)], function (Factory) {
                            component = self.createComponent(Factory, {});
                            cb();
                        }, cb);
                    })
                    .seq(function (cb) {

                        if (self.setupComponent.length === 2) {
                            self.setupComponent(component, cb);
                        } else {
                            self.setupComponent(component);
                            cb();
                        }
                    })
                    .seq(function () {
                        window.component = component;
                        self.addChild(component);
                        self.component = component;
                    })
                    .exec(function (err) {
                        if (!err) {
                            Application.prototype.start.call(self, parameter, callback);
                        } else {
                            callback(err);
                        }
                    });
            } else {
                this.callBase();
            }



        }
    });
});
