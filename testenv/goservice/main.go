package main

import (
	"encoding/json"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/nats-io/nats.go"
)

func env(key string) (string, error) {
	val := os.Getenv(key)
	if val == "" {
		return "", fmt.Errorf("mandatory env variable %s is missing", key)
	}

	return val, nil
}

type nodeRequestPayload struct {
	Operation string `json:"operation"`
	Stuff     []int  `json:"stuff"`
}

func replier(conn *nats.Conn) {
	conn.Subscribe("node_does_request", func(msg *nats.Msg) {
		fmt.Printf("node_does_request %s\n", msg.Data)

		var payload nodeRequestPayload
		if err := json.Unmarshal(msg.Data, &payload); err != nil {
			resData, _ := json.Marshal(map[string]string{
				"error": "cant unmarshal man",
			})

			msg.Respond(resData)
			return
		}

		if payload.Operation != "SUM" {
			resData, _ := json.Marshal(map[string]string{
				"error": "nope i need sum",
			})

			msg.Respond(resData)
			return
		}

		var sum int
		for _, num := range payload.Stuff {
			sum += num
		}

		resData, _ := json.Marshal(map[string]int{
			"hereWeGOOOO": sum,
		})

		msg.Respond(resData)
		log.Println("handled that node_does_request")
	})

	conn.Subscribe("big_request", func(msg *nats.Msg) {
		fmt.Printf("node_does_request %s\n", msg.Data)

		resData, _ := json.Marshal(map[string][]string{
			"uuuuuu": {
				"123", "123", "123",
				"At", "vero", "eos", "et", "accusamus", "et", "iusto", "odio", "dignissimos", "ducimus", "qui",
				"blanditiis", "praesentium", "voluptatum", "deleniti", "atque", "corrupti", "quos", "dolores",
				"et", "quas", "molestias", "excepturi", "sint", "occaecati", "cupiditate", "non", "provident,",
				"similique", "sunt", "in", "culpa", "qui", "officia", "deserunt", "mollitia", "animi,", "id", "est",
				"laborum", "et", "dolorum", "fuga.", "Et", "harum", "quidem", "rerum", "facilis", "est", "et", "expedita", "distinctio.",
				"Nam", "libero", "tempore,", "cum", "soluta", "nobis", "est", "eligendi", "optio", "cumque", "nihil", "impedit",
				"quo", "minus", "id", "quod", "maxime", "placeat", "facere", "possimus,", "omnis", "voluptas", "assumenda", "est,",
				"omnis", "dolor", "repellendus.", "Temporibus", "autem", "quibusdam", "et", "aut", "officiis", "debitis", "aut",
				"rerum", "necessitatibus", "saepe",
				"eveniet", "ut", "et", "voluptates", "repudiandae", "sint", "et", "molestiae", "non", "recusandae",
			},
		})

		msg.Respond(resData)
		log.Println("handled that node_does_request")
	})
}

func pub1(conn *nats.Conn) {
	data, _ := json.Marshal(map[string]string{
		"now": time.Now().Format(time.Kitchen),
		"abc": "defg",
	})

	log.Println("publishing go_needs_to_tell_something")
	conn.Publish("go_needs_to_tell_something", data)

}

func publisher(conn *nats.Conn) {
	for {
		pub1(conn)
		time.Sleep(time.Second * 5)
	}
}

func subscriber(conn *nats.Conn) {
	conn.Subscribe("whasup_from_node", func(msg *nats.Msg) {
		log.Printf("whasup_from_node %s\n", msg.Data)
	})
}

func start() error {
	natsHost, err := env("NATS_HOST")
	if err != nil {
		return err
	}
	natsPort, err := env("NATS_PORT")
	if err != nil {
		return err
	}

	natsUrl := fmt.Sprintf("%s:%s", natsHost, natsPort)
	log.Printf("connecting to nats %s\n", natsUrl)

	natsConn, err := nats.Connect(natsUrl)
	if err != nil {
		return err
	}

	log.Println("replier started")
	replier(natsConn)
	log.Println("subscriber goes")
	subscriber(natsConn)
	log.Println("publisher")
	publisher(natsConn)

	return nil
}

func main() {
	if err := start(); err != nil {
		log.Println(err)
		os.Exit(1)
	}
}
