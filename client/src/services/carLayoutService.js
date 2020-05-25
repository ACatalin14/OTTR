import axios from 'axios';
import CONSTANTS from "../constants";

export default {
    getByName(name) {
        return axios
            .get(CONSTANTS.SERVER_URL + '/car-layout/name/' + name)
            .then(response => response.data)
            .catch(this.throwServerError);
    },

    throwServerError(err) {
        if (err.response) {
            throw err;
        }

        err.response = {data: {err: {message: CONSTANTS.ERRORS.UNREACHABLE_SERVER}}};
        throw err;
    },

    getPngNameFromElementType(elementType) {

        switch (elementType) {
            case CONSTANTS.LAYOUT.ELEMENTS.SEAT_LEFT:
                return 'seat-left.png';
            case CONSTANTS.LAYOUT.ELEMENTS.SEAT_RIGHT:
                return 'seat-right.png';
            case CONSTANTS.LAYOUT.ELEMENTS.SEAT_UP:
                return 'seat-up.png';
            case CONSTANTS.LAYOUT.ELEMENTS.SEAT_DOWN:
                return 'seat-down.png';
            case CONSTANTS.LAYOUT.ELEMENTS.RESERVED_SEAT_LEFT:
                return 'reserved-seat-left.png';
            case CONSTANTS.LAYOUT.ELEMENTS.RESERVED_SEAT_RIGHT:
                return 'reserved-seat-right.png';
            case CONSTANTS.LAYOUT.ELEMENTS.RESERVED_SEAT_UP:
                return 'reserved-seat-up.png';
            case CONSTANTS.LAYOUT.ELEMENTS.RESERVED_SEAT_DOWN:
                return 'reserved-seat-down.png';
            case CONSTANTS.LAYOUT.ELEMENTS.SELECTED_SEAT_LEFT:
                return 'selected-seat-left.png';
            case CONSTANTS.LAYOUT.ELEMENTS.SELECTED_SEAT_RIGHT:
                return 'selected-seat-right.png';
            case CONSTANTS.LAYOUT.ELEMENTS.SELECTED_SEAT_UP:
                return 'selected-seat-up.png';
            case CONSTANTS.LAYOUT.ELEMENTS.SELECTED_SEAT_DOWN:
                return 'selected-seat-down.png';
            case CONSTANTS.LAYOUT.ELEMENTS.RESERVING_SEAT_LEFT:
                return 'reserving-seat-left.png';
            case CONSTANTS.LAYOUT.ELEMENTS.RESERVING_SEAT_RIGHT:
                return 'reserving-seat-right.png';
            case CONSTANTS.LAYOUT.ELEMENTS.RESERVING_SEAT_UP:
                return 'reserving-seat-up.png';
            case CONSTANTS.LAYOUT.ELEMENTS.RESERVING_SEAT_DOWN:
                return 'reserving-seat-down.png';
            case CONSTANTS.LAYOUT.ELEMENTS.LUGGAGE_RACK:
                return 'luggage-rack.png';
            case CONSTANTS.LAYOUT.ELEMENTS.TABLE:
                return 'table.png';
            case CONSTANTS.LAYOUT.ELEMENTS.WALL:
                return 'wall.png';
            default:
                console.error('No image found for: ' + elementType);
                return 'no-existing-png-for-this-type';
        }
    },

    transformFromMongo2FrontendModel(carLayoutDb) {
        let carLayoutFrontend = {};

        carLayoutFrontend.name = carLayoutDb.name;
        carLayoutFrontend.seatingCapacity = carLayoutDb.seatingCapacity;
        carLayoutFrontend.width = carLayoutDb.width;
        carLayoutFrontend.height = carLayoutDb.height;
        carLayoutFrontend.cellSize = carLayoutDb.cellSize;
        carLayoutFrontend.lastElementId = carLayoutDb.lastElementId;

        carLayoutFrontend.gridLayout = [];
        for (let element of carLayoutDb.elements) {
            carLayoutFrontend.gridLayout.push(JSON.parse(JSON.stringify(element)));
        }

        carLayoutFrontend.sheetWidth =  carLayoutDb.cellSize * carLayoutDb.width + CONSTANTS.LAYOUT.GRID_MARGIN *
            (carLayoutDb.width - 1) + 2 * 4 * 5;

        carLayoutFrontend.sheetHeight =  carLayoutDb.cellSize * carLayoutDb.height + CONSTANTS.LAYOUT.GRID_MARGIN *
            (carLayoutDb.height - 1) + 2 * 4 * 5;

        return carLayoutFrontend;
    },

    /**
     * Rotate a car layout if the given layout is made for big screens
     *
     * rotate(LongLayout) => TallLayout
     * rotate(TallLayout) => TallLayout
     */
    rotateCarLayout(carLayout) {
        if (typeof carLayout !== 'object') {
            console.error('Car Layout to be rotated is not an object!');
            return { };
        }

        if (!Object.keys(carLayout).length) {
            return { };
        }

        if (carLayout.width <= carLayout.height) {
            // car layout is already rotated for small screens, so do not rotate it again!
            return carLayout;
        }

        let rotatedCarLayout = {
            name: carLayout.name,
            seatingCapacity: carLayout.seatingCapacity,
            width: carLayout.height,
            height: carLayout.width,
            cellSize: carLayout.cellSize,
            lastElementId: carLayout.lastElementId,
            sheetWidth: carLayout.cellSize * carLayout.height + CONSTANTS.LAYOUT.GRID_MARGIN *
                (carLayout.height - 1) + 2 * 4 * 5,
            sheetHeight: carLayout.cellSize * carLayout.width + CONSTANTS.LAYOUT.GRID_MARGIN *
                (carLayout.width - 1) + 2 * 4 * 5
        };

        rotatedCarLayout.gridLayout = [];
        for (let element of carLayout.gridLayout) {
            let newElement = {
                i: element.i,
                x: carLayout.height - element.h - element.y,
                y: element.x,
                w: element.h,
                h: element.w,
                type: element.type
            };

            if (element.seatNumber) {
                newElement.seatNumber = element.seatNumber;

                switch (element.type) {
                    case CONSTANTS.LAYOUT.ELEMENTS.SEAT_LEFT:
                        newElement.type = CONSTANTS.LAYOUT.ELEMENTS.SEAT_UP;
                        break;
                    case CONSTANTS.LAYOUT.ELEMENTS.SEAT_UP:
                        newElement.type = CONSTANTS.LAYOUT.ELEMENTS.SEAT_RIGHT;
                        break;
                    case CONSTANTS.LAYOUT.ELEMENTS.SEAT_RIGHT:
                        newElement.type = CONSTANTS.LAYOUT.ELEMENTS.SEAT_DOWN;
                        break;
                    case CONSTANTS.LAYOUT.ELEMENTS.SEAT_DOWN:
                        newElement.type = CONSTANTS.LAYOUT.ELEMENTS.SEAT_LEFT;
                        break;
                    case CONSTANTS.LAYOUT.ELEMENTS.RESERVED_SEAT_LEFT:
                        newElement.type = CONSTANTS.LAYOUT.ELEMENTS.RESERVED_SEAT_UP;
                        break;
                    case CONSTANTS.LAYOUT.ELEMENTS.RESERVED_SEAT_UP:
                        newElement.type = CONSTANTS.LAYOUT.ELEMENTS.RESERVED_SEAT_RIGHT;
                        break;
                    case CONSTANTS.LAYOUT.ELEMENTS.RESERVED_SEAT_RIGHT:
                        newElement.type = CONSTANTS.LAYOUT.ELEMENTS.RESERVED_SEAT_DOWN;
                        break;
                    case CONSTANTS.LAYOUT.ELEMENTS.RESERVED_SEAT_DOWN:
                        newElement.type = CONSTANTS.LAYOUT.ELEMENTS.RESERVED_SEAT_LEFT;
                        break;
                    case CONSTANTS.LAYOUT.ELEMENTS.SELECTED_SEAT_LEFT:
                        newElement.type = CONSTANTS.LAYOUT.ELEMENTS.SELECTED_SEAT_UP;
                        break;
                    case CONSTANTS.LAYOUT.ELEMENTS.SELECTED_SEAT_UP:
                        newElement.type = CONSTANTS.LAYOUT.ELEMENTS.SELECTED_SEAT_RIGHT;
                        break;
                    case CONSTANTS.LAYOUT.ELEMENTS.SELECTED_SEAT_RIGHT:
                        newElement.type = CONSTANTS.LAYOUT.ELEMENTS.SELECTED_SEAT_DOWN;
                        break;
                    case CONSTANTS.LAYOUT.ELEMENTS.SELECTED_SEAT_DOWN:
                        newElement.type = CONSTANTS.LAYOUT.ELEMENTS.SELECTED_SEAT_LEFT;
                        break;
                    case CONSTANTS.LAYOUT.ELEMENTS.RESERVING_SEAT_LEFT:
                        newElement.type = CONSTANTS.LAYOUT.ELEMENTS.RESERVING_SEAT_UP;
                        break;
                    case CONSTANTS.LAYOUT.ELEMENTS.RESERVING_SEAT_UP:
                        newElement.type = CONSTANTS.LAYOUT.ELEMENTS.RESERVING_SEAT_RIGHT;
                        break;
                    case CONSTANTS.LAYOUT.ELEMENTS.RESERVING_SEAT_RIGHT:
                        newElement.type = CONSTANTS.LAYOUT.ELEMENTS.RESERVING_SEAT_DOWN;
                        break;
                    case CONSTANTS.LAYOUT.ELEMENTS.RESERVING_SEAT_DOWN:
                        newElement.type = CONSTANTS.LAYOUT.ELEMENTS.RESERVING_SEAT_LEFT;
                        break;
                    default:
                        console.error('Unknown type for an element having a seat number!');
                }
            }

            rotatedCarLayout.gridLayout.push(newElement);
        }

        return rotatedCarLayout;
    },

    /**
     *
     * @param car
     * @param departureStation {RouteStation}
     * @param arrivalStation {RouteStation}
     * @param user
     */
    fillCarLayoutWithColorfulSeats(car, departureStation, arrivalStation, user) {

        const reqDep = departureStation.orderNo;    // required (wished) departure Station number
        const reqArr = arrivalStation.orderNo;    // required (wished) departure Station number

        for (let seat of car.seats) {

            if (!seat.reservations.length && !seat.selected) {
                // clearly a free seat (no reservations + not selected by anyone)
                continue;
            }

            if (seat.selected) {
                // found a seat which selected by someone (the client or somebody else using right now the app)
                this.changeSeatAppearance(car, seat, user);
                continue;
            }

            let conflictsWithOurRide = false;

            for (let ticket of seat.reservations) {

                const busyDep = ticket.departureStation.orderNo;
                const busyArr = ticket.arrivalStation.orderNo;

                if ((reqDep < busyDep && reqArr > busyDep) ||
                    reqDep === busyDep ||
                    (reqDep > busyDep && reqDep < busyArr)
                ) {
                    conflictsWithOurRide = true;
                    break;
                }
            }

            if (!conflictsWithOurRide) {
                // free seat for requested ride
                continue;
            }

            this.changeSeatAppearance(car, seat, user);
        }

        return car.carLayout;
    },

    changeSeatAppearance(car, seat, user) {

        // search for seat in car layout
        const index = car.carLayout.gridLayout.findIndex( elem => {
            return elem.seatNumber === seat.number;
        });

        // check if seat is selected by our client
        if (seat.selectingUser === user._id) {
            car.carLayout.gridLayout[index].type = this.getSelectedSeatTypeFromUnselected(car.carLayout.gridLayout[index].type);
            return;
        }

        if (!seat.selected) {
            // this is a seat which has already been booked by another client
            car.carLayout.gridLayout[index].type = this.getCorrespondingReservedSeatAppearance(car.carLayout.gridLayout[index].type);
            return;
        }

        // someone else is selecting this seat
        car.carLayout.gridLayout[index].type = this.getReservingSeatTypeFromUnselected(car.carLayout.gridLayout[index].type);
    },

    getCorrespondingReservedSeatAppearance(initialType) {

        switch (initialType) {
            case CONSTANTS.LAYOUT.ELEMENTS.SEAT_LEFT:
                return CONSTANTS.LAYOUT.ELEMENTS.RESERVED_SEAT_LEFT;

            case CONSTANTS.LAYOUT.ELEMENTS.SEAT_RIGHT:
                return CONSTANTS.LAYOUT.ELEMENTS.RESERVED_SEAT_RIGHT;

            case CONSTANTS.LAYOUT.ELEMENTS.SEAT_UP:
                return CONSTANTS.LAYOUT.ELEMENTS.RESERVED_SEAT_UP;

            case CONSTANTS.LAYOUT.ELEMENTS.SEAT_DOWN:
                return CONSTANTS.LAYOUT.ELEMENTS.RESERVED_SEAT_DOWN;

            default:
                console.error('Unknown seat type to make an association');
                return null;
        }
    },

    getSelectedSeatTypeFromUnselected(elementType) {

        switch (elementType) {
            case CONSTANTS.LAYOUT.ELEMENTS.SEAT_LEFT:
                return CONSTANTS.LAYOUT.ELEMENTS.SELECTED_SEAT_LEFT;

            case CONSTANTS.LAYOUT.ELEMENTS.SEAT_RIGHT:
                return CONSTANTS.LAYOUT.ELEMENTS.SELECTED_SEAT_RIGHT;

            case CONSTANTS.LAYOUT.ELEMENTS.SEAT_UP:
                return CONSTANTS.LAYOUT.ELEMENTS.SELECTED_SEAT_UP;

            case CONSTANTS.LAYOUT.ELEMENTS.SEAT_DOWN:
                return CONSTANTS.LAYOUT.ELEMENTS.SELECTED_SEAT_DOWN;

            default:
                console.error('This is not an unselected seat!');
                return null;
        }
    },

    getReservingSeatTypeFromUnselected(elementType) {

        switch (elementType) {
            case CONSTANTS.LAYOUT.ELEMENTS.SEAT_LEFT:
                return CONSTANTS.LAYOUT.ELEMENTS.RESERVING_SEAT_LEFT;

            case CONSTANTS.LAYOUT.ELEMENTS.SEAT_RIGHT:
                return CONSTANTS.LAYOUT.ELEMENTS.RESERVING_SEAT_RIGHT;

            case CONSTANTS.LAYOUT.ELEMENTS.SEAT_UP:
                return CONSTANTS.LAYOUT.ELEMENTS.RESERVING_SEAT_UP;

            case CONSTANTS.LAYOUT.ELEMENTS.SEAT_DOWN:
                return CONSTANTS.LAYOUT.ELEMENTS.RESERVING_SEAT_DOWN;

            default:
                console.error('This is not a seat selected by someone else!');
                return null;
        }
    }
}