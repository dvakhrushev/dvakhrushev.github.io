angular.module('app')
    .factory('WallboardStorage', [function(){
        var Store = Backbone.Collection.extend({
            EDIT_PREFIX: 'edit',
            setTheme: function (id, theme) {
                var board = this.get(id);
                var config = board.get('config');
                config = _.assign(config, {'colorScheme': theme});

                board.set({'config': config});
            },

            getTheme: function (id) {
                return this.get(id).get('config').colorScheme;
            },

            createEditCopy: function (id) {
                var currentBoard = _.cloneDeep(this.get(id).toJSON());
                var newBoardId = this.EDIT_PREFIX + currentBoard.id;
                var newBoard = _.assign({}, currentBoard, {
                    id: newBoardId,
                    realId: id
                });
                this.add(newBoard, {merge: true});

                return newBoardId;
            },

            applyEditCopy: function (editId) {
                var editBoard = this.get(editId);
                var realId = editBoard.get('realId');
                var realBoard = this.get('realId');
                this.remove(editId);

                editBoard.set({
                    id: realId,
                    realId: undefined
                });
                return this.add(editBoard, {merge: true});
            }
        });

        return new Store();
    }]);
