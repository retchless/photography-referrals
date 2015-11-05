'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { var object = _x, property = _x2, receiver = _x3; desc = parent = getter = undefined; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var ReferralForm = (function (_React$Component) {
    _inherits(ReferralForm, _React$Component);

    function ReferralForm() {
        _classCallCheck(this, ReferralForm);

        _get(Object.getPrototypeOf(ReferralForm.prototype), 'constructor', this).apply(this, arguments);
    }

    _createClass(ReferralForm, [{
        key: 'render',
        value: function render() {
            return _react2['default'].createElement(
                'div',
                { className: 'app container' },
                _react2['default'].createElement(
                    'h3',
                    null,
                    'Refer to another Wedding Photographer'
                ),
                _react2['default'].createElement(
                    'form',
                    null,
                    _react2['default'].createElement(
                        'div',
                        { className: 'form-group' },
                        _react2['default'].createElement(
                            'label',
                            { 'for': 'referring-photog' },
                            'Referring photographer'
                        ),
                        _react2['default'].createElement(
                            'select',
                            { className: 'form-control', id: 'referring-photog' },
                            _react2['default'].createElement(
                                'option',
                                null,
                                'Shlomi Amiga'
                            ),
                            _react2['default'].createElement(
                                'option',
                                null,
                                'Scarlet O\'Neill'
                            ),
                            _react2['default'].createElement(
                                'option',
                                null,
                                'Annuj Yoganathan'
                            ),
                            _react2['default'].createElement(
                                'option',
                                null,
                                'Erika Hammer'
                            )
                        )
                    ),
                    _react2['default'].createElement(
                        'div',
                        { className: 'form-group' },
                        _react2['default'].createElement(
                            'label',
                            { 'for': 'client-first-name' },
                            'Client first name:'
                        ),
                        _react2['default'].createElement('input', { type: 'text', className: 'form-control', id: 'client-first-name' })
                    ),
                    _react2['default'].createElement(
                        'div',
                        { className: 'form-group' },
                        _react2['default'].createElement(
                            'label',
                            { 'for': 'client-last-name' },
                            'Client last name:'
                        ),
                        _react2['default'].createElement('input', { type: 'text', className: 'form-control', id: 'client-last-name' })
                    ),
                    _react2['default'].createElement(
                        'div',
                        { className: 'form-group' },
                        _react2['default'].createElement(
                            'label',
                            { 'for': 'wedding-date' },
                            'Wedding date (including year):'
                        ),
                        _react2['default'].createElement('input', { type: 'text', className: 'form-control', id: 'wedding-date' })
                    ),
                    _react2['default'].createElement(
                        'div',
                        { className: 'form-group' },
                        _react2['default'].createElement(
                            'label',
                            { 'for': 'wedding-city' },
                            'Wedding city'
                        ),
                        _react2['default'].createElement('input', { type: 'text', className: 'form-control', id: 'wedding-city' })
                    ),
                    _react2['default'].createElement(
                        'div',
                        { className: 'form-group' },
                        _react2['default'].createElement(
                            'label',
                            { 'for': 'wedding-venue' },
                            'Wedding venue'
                        ),
                        _react2['default'].createElement('input', { type: 'text', className: 'form-control', id: 'wedding-venue' })
                    ),
                    _react2['default'].createElement(
                        'div',
                        { className: 'form-group' },
                        _react2['default'].createElement(
                            'label',
                            { 'for': 'additional-notes' },
                            'Additional notes'
                        ),
                        _react2['default'].createElement('textarea', { id: 'additional-notes', name: 'message', rows: '10', cols: '30', className: 'form-control' })
                    ),
                    _react2['default'].createElement(
                        'button',
                        { className: 'btn btn-primary' },
                        'Submit'
                    )
                )
            );
        }
    }]);

    return ReferralForm;
})(_react2['default'].Component);

exports['default'] = ReferralForm;
module.exports = exports['default'];